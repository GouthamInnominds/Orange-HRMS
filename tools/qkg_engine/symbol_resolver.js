/**
 * Two-Pass FQCN Symbol & Exact-Signature CALLS Resolver
 *
 * Pass 1 indexes all Classes, Interfaces, Traits, property types, constructor DI types,
 * and Method signatures across all 23 OrangeHRM plugins (+ src/lib framework).
 * Pass 1.5 resolves raw AST call descriptors into structured references with explicit
 * `resolution_status: 'RESOLVED' | 'UNRESOLVED'`.
 * Pass 2 emits ONLY exact `(callerSignature)-[:CALLS]->(calleeSignature)` pairs where
 * both endpoints exist in the verified Method symbol inventory (eliminating bare-name false positives).
 */

class SymbolResolver {
  constructor(parsedFiles) {
    this.classesByFqcn = new Map();
    this.interfacesByFqcn = new Map();
    this.traitsByFqcn = new Map();
    this.typeByFqcn = new Map();
    this.methodBySignature = new Map();
    this.classesByShortName = new Map();
    this._buildIndex(parsedFiles);
  }

  _buildIndex(parsedFiles) {
    const registerType = (entry, store) => {
      if (!entry || !entry.fqcn) return;
      store.set(entry.fqcn, entry);
      this.typeByFqcn.set(entry.fqcn, entry);

      const shortName = entry.name;
      if (!this.classesByShortName.has(shortName)) {
        this.classesByShortName.set(shortName, []);
      }
      this.classesByShortName.get(shortName).push(entry.fqcn);

      const methodMap = new Map();
      for (const m of entry.methods || []) {
        methodMap.set(m.name, m);
        this.methodBySignature.set(m.signature, m);
      }
      entry._methodMap = methodMap;
    };

    for (const pf of parsedFiles) {
      if (!pf) continue;
      for (const cls of pf.classes || []) registerType(cls, this.classesByFqcn);
      for (const iface of pf.interfaces || []) registerType(iface, this.interfacesByFqcn);
      for (const tr of pf.traits || []) registerType(tr, this.traitsByFqcn);
    }

    // Apply property assignments found in __construct / setUp onto class property_types
    for (const cls of this.classesByFqcn.values()) {
      for (const m of cls.methods || []) {
        if (m.name === '__construct' || m.name === 'setUp') {
          for (const pa of m.propertyAssignments || []) {
            if (!cls.property_types[pa.propName]) {
              const resolvedType = this._resolveExprType(pa.desc, cls, m, new Set());
              if (resolvedType) {
                cls.property_types[pa.propName] = resolvedType;
              }
            }
          }
        }
      }
    }
  }

  findMethodInHierarchy(ownerFqcn, methodName, visited = new Set()) {
    if (!ownerFqcn || !methodName || visited.has(ownerFqcn)) return null;
    visited.add(ownerFqcn);

    const owner = this.typeByFqcn.get(ownerFqcn);
    if (!owner) return null;

    if (owner._methodMap && owner._methodMap.has(methodName)) {
      return owner._methodMap.get(methodName);
    }

    // Check traits used directly on this class/trait
    for (const trFqcn of owner.trait_fqcns || []) {
      const m = this.findMethodInHierarchy(trFqcn, methodName, visited);
      if (m) return m;
    }

    // Check parent class or extended interfaces
    if (owner.extends_fqcn) {
      const m = this.findMethodInHierarchy(owner.extends_fqcn, methodName, visited);
      if (m) return m;
    }
    if (Array.isArray(owner.extends)) {
      for (const extFqcn of owner.extends) {
        const m = this.findMethodInHierarchy(extFqcn, methodName, visited);
        if (m) return m;
      }
    }
    for (const ifaceFqcn of owner.implements || []) {
      const m = this.findMethodInHierarchy(ifaceFqcn, methodName, visited);
      if (m) return m;
    }

    return null;
  }

  _findPropertyTypeInHierarchy(ownerFqcn, propName, visited = new Set()) {
    if (!ownerFqcn || !propName || visited.has(ownerFqcn)) return null;
    visited.add(ownerFqcn);
    const owner = this.typeByFqcn.get(ownerFqcn);
    if (!owner) return null;

    if (owner.property_types && owner.property_types[propName]) {
      return owner.property_types[propName];
    }
    for (const trFqcn of owner.trait_fqcns || []) {
      const t = this._findPropertyTypeInHierarchy(trFqcn, propName, visited);
      if (t) return t;
    }
    if (owner.extends_fqcn) {
      const t = this._findPropertyTypeInHierarchy(owner.extends_fqcn, propName, visited);
      if (t) return t;
    }
    return null;
  }

  _resolveExprType(desc, currentClass, currentMethod, depthGuard = new Set()) {
    if (!desc) return null;
    const key = JSON.stringify(desc);
    if (depthGuard.has(key) || depthGuard.size > 8) return null;
    depthGuard.add(key);

    if (desc.kind === 'THIS') {
      return currentClass.fqcn;
    }
    if (desc.kind === 'STATIC_TYPE') {
      return desc.fqcn;
    }
    if (desc.kind === 'VAR') {
      const varEntry = currentMethod.localVarTypes && currentMethod.localVarTypes[desc.varName];
      if (!varEntry) return null;
      return this._resolveExprType(varEntry, currentClass, currentMethod, depthGuard);
    }
    if (desc.kind === 'PROP') {
      const ownerFqcn = this._resolveExprType(desc.owner, currentClass, currentMethod, depthGuard);
      if (!ownerFqcn) return null;
      return this._findPropertyTypeInHierarchy(ownerFqcn, desc.prop);
    }
    if (desc.kind === 'CALL_RESULT' && desc.call) {
      const resolvedCall = this._resolveSingleCall(desc.call, currentClass, currentMethod, depthGuard);
      if (resolvedCall && resolvedCall.targetMethod) {
        return resolvedCall.targetMethod.return_type_fqcn || null;
      }
      if (desc.call.targetFqcn && desc.call.methodName === 'getEntityManager') {
        return 'Doctrine\\ORM\\EntityManager';
      }
    }
    return null;
  }

  _resolveSingleCall(callDesc, currentClass, currentMethod, depthGuard = new Set()) {
    if (!callDesc || !callDesc.methodName) return null;

    let targetClassFqcn = null;
    let callType = callDesc.kind;

    if (callDesc.kind === 'SELF' || callDesc.kind === 'STATIC_SELF') {
      targetClassFqcn = currentClass.fqcn;
    } else if (callDesc.kind === 'PARENT') {
      targetClassFqcn = currentClass.extends_fqcn || null;
    } else if (callDesc.kind === 'STATIC') {
      targetClassFqcn = callDesc.targetFqcn || null;
    } else if (callDesc.kind === 'INSTANCE') {
      targetClassFqcn = this._resolveExprType(callDesc.receiver, currentClass, currentMethod, depthGuard);
    } else {
      return { resolution_status: 'UNRESOLVED', reason: 'UNHANDLED_CALL_KIND', call_type: callType };
    }

    if (!targetClassFqcn) {
      return { resolution_status: 'UNRESOLVED', reason: 'RECEIVER_TYPE_UNKNOWN', call_type: callType };
    }

    const targetMethod = this.findMethodInHierarchy(targetClassFqcn, callDesc.methodName);
    if (!targetMethod || !this.methodBySignature.has(targetMethod.signature)) {
      return {
        resolution_status: 'UNRESOLVED',
        reason: 'CALLEE_METHOD_NOT_IN_INVENTORY',
        call_type: callType,
        targetClassFqcn,
        methodName: callDesc.methodName
      };
    }

    return {
      resolution_status: 'RESOLVED',
      call_type: callType,
      targetClassFqcn: targetMethod.class_fqcn,
      targetMethod,
      calleeSignature: targetMethod.signature,
      confidence: targetMethod.class_fqcn === targetClassFqcn ? 1.0 : 0.95,
      evidence_type: 'AST_CALL_ANALYSIS'
    };
  }

  resolveAllCalls() {
    const resolvedEdges = [];
    const seenEdges = new Set();
    const diagnostics = { totalRawCalls: 0, resolved: 0, unresolved: 0, unresolvedReasons: {} };

    const inspectTypes = [
      ...this.classesByFqcn.values(),
      ...this.traitsByFqcn.values()
    ];

    for (const owner of inspectTypes) {
      for (const method of owner.methods || []) {
        for (const rawCall of method.rawCalls || []) {
          diagnostics.totalRawCalls++;
          const res = this._resolveSingleCall(rawCall, owner, method, new Set());
          if (res && res.resolution_status === 'RESOLVED') {
            diagnostics.resolved++;
            const edgeKey = `${method.signature}->${res.calleeSignature}`;
            if (!seenEdges.has(edgeKey) && method.signature !== res.calleeSignature) {
              seenEdges.add(edgeKey);
              resolvedEdges.push({
                callerSignature: method.signature,
                calleeSignature: res.calleeSignature,
                call_type: res.call_type,
                confidence: res.confidence,
                evidence_type: res.evidence_type
              });
            }
          } else {
            diagnostics.unresolved++;
            const reason = (res && res.reason) || 'UNKNOWN';
            diagnostics.unresolvedReasons[reason] = (diagnostics.unresolvedReasons[reason] || 0) + 1;
          }
        }
      }
    }

    return { resolvedEdges, diagnostics };
  }
}

module.exports = SymbolResolver;

