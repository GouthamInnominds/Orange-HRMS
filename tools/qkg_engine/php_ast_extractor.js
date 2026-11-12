/**
 * OrangeHRM QKG PHP AST Extractor (Two-Pass Ready)
 * Powered by Glayzzle php-parser
 *
 * Extracts:
 * - File use-import maps (single and grouped `use` statements)
 * - Classes, Interfaces, and Traits with full FQCNs, resolved extends/implements/uses_trait,
 *   typed properties (`prop.type`), constructor DI parameters, and ORM metadata
 * - Methods with typed parameters, return types, DocBlock annotations (@covers, @return, @var),
 *   local variable type bindings (new/mock/typed params), chained/instance/static calls,
 *   and Doctrine QueryBuilder/DQL/Raw SQL hints.
 */

const fs = require('fs');
const path = require('path');
const { Engine } = require('php-parser');
const { toRepoRelPath } = require('./qkg_config');
const { sha256Hex, hashAstNode } = require('./canonical_hash');

const parser = new Engine({
  parser: {
    extractDoc: true,
    php8: true,
    php7: true
  },
  ast: {
    withPositions: true
  }
});

const BUILTIN_SCALARS = new Set([
  'int', 'integer', 'float', 'double', 'string', 'bool', 'boolean',
  'array', 'object', 'callable', 'iterable', 'void', 'mixed', 'never',
  'null', 'false', 'true', 'parent', 'stdClass'
]);

function normalizeTypeString(typeNode) {
  if (!typeNode) return null;
  if (typeof typeNode === 'string') return typeNode;
  if (typeNode.kind === 'selfreference') return 'self';
  if (typeNode.kind === 'staticreference') return 'static';
  if (typeNode.kind === 'parentreference') return 'parent';
  if (typeNode.kind === 'uniontype' || typeNode.kind === 'intersectiontype') {
    const types = Array.isArray(typeNode.types) ? typeNode.types : [];
    for (const t of types) {
      const n = normalizeTypeString(t);
      if (n && !BUILTIN_SCALARS.has(n.toLowerCase())) return n;
    }
    return normalizeTypeString(types[0]);
  }
  if (typeNode.name) {
    return typeof typeNode.name === 'string' ? typeNode.name : (typeNode.name.name || null);
  }
  if (typeNode.raw && typeof typeNode.raw === 'string') return typeNode.raw;
  return null;
}

function resolveTypeName(rawName, currentNamespace, useMap, selfFqcn = null) {
  if (!rawName || typeof rawName !== 'string') return null;
  const trimmed = rawName.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'self' || lower === 'static') return selfFqcn || trimmed;
  if (BUILTIN_SCALARS.has(lower)) return trimmed;

  if (trimmed.startsWith('\\')) {
    return trimmed.replace(/^\\+/, '');
  }

  const parts = trimmed.split('\\');
  const head = parts[0];
  const resolvedHead = useMap && (useMap[head] || useMap[head.toLowerCase()]);
  if (resolvedHead) {
    if (parts.length === 1) return resolvedHead;
    return `${resolvedHead}\\${parts.slice(1).join('\\')}`;
  }

  return currentNamespace ? `${currentNamespace}\\${trimmed}` : trimmed;
}

function extractLeadingDoc(node) {
  if (!node || !Array.isArray(node.leadingComments) || node.leadingComments.length === 0) {
    return '';
  }
  return node.leadingComments.map(c => c.value || '').join('\n');
}

function parseCoversTags(docText) {
  const covers = [];
  if (!docText) return covers;
  const regex = /@covers\s+([^\s*]+)/g;
  let m;
  while ((m = regex.exec(docText)) !== null) {
    covers.push(m[1].trim());
  }
  return covers;
}

function parseCoversDefaultClass(docText) {
  if (!docText) return null;
  const m = docText.match(/@coversDefaultClass\s+([^\s*]+)/);
  return m ? m[1].trim() : null;
}

class PhpAstExtractor {
  constructor(options = {}) {
    this.parserVersion = options.parserVersion || '2.2.0';
    this.commitSha = options.commitSha || null;
  }

  parseFile(filePath, relPath = null) {
    const code = fs.readFileSync(filePath, 'utf8');
    const canonicalRel = toRepoRelPath(relPath || filePath);
    let ast;
    try {
      ast = parser.parseCode(code, path.basename(filePath));
    } catch (err) {
      console.warn(`[PhpAstExtractor] Syntax error in ${canonicalRel}: ${err.message}`);
      return null;
    }

    const result = {
      file: canonicalRel,
      classes: [],
      interfaces: [],
      traits: [],
      entities: []
    };

    const initialUseMap = {};
    this._traverse(ast, result, null, initialUseMap, code);
    return result;
  }

  _collectUseGroup(node, useMap) {
    if (!node || !Array.isArray(node.items)) return;
    const prefix = node.name ? String(node.name).replace(/^\\+|\\+$/g, '') : '';
    for (const item of node.items) {
      if (!item || !item.name) continue;
      const itemName = String(item.name).replace(/^\\+/, '');
      const fullFqcn = prefix ? `${prefix}\\${itemName}` : itemName;
      const shortName = (item.alias && (item.alias.name || item.alias)) || fullFqcn.split('\\').pop();
      useMap[shortName] = fullFqcn;
      useMap[shortName.toLowerCase()] = fullFqcn;
    }
  }

  _traverse(node, result, currentNamespace = null, useMap = {}, sourceCode = '') {
    if (!node || typeof node !== 'object') return;

    if (node.kind === 'namespace') {
      const nsName = typeof node.name === 'string'
        ? node.name
        : (node.name && node.name.name ? node.name.name : currentNamespace);
      const nsUseMap = { ...useMap };
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          if (child && child.kind === 'usegroup') {
            this._collectUseGroup(child, nsUseMap);
          } else {
            this._traverse(child, result, nsName, nsUseMap, sourceCode);
          }
        }
      }
      return;
    }

    if (node.kind === 'usegroup') {
      this._collectUseGroup(node, useMap);
      return;
    }

    if (node.kind === 'class') {
      const cls = this._extractClass(node, currentNamespace, useMap, sourceCode, result.file);
      if (cls) {
        result.classes.push(cls);
        if (cls.isOrmEntity) {
          result.entities.push(cls);
        }
      }
      return;
    }

    if (node.kind === 'interface') {
      const iface = this._extractInterface(node, currentNamespace, useMap, result.file);
      if (iface) result.interfaces.push(iface);
      return;
    }

    if (node.kind === 'trait') {
      const tr = this._extractTrait(node, currentNamespace, useMap, result.file);
      if (tr) result.traits.push(tr);
      return;
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        this._traverse(child, result, currentNamespace, useMap, sourceCode);
      }
    }
  }

  _extractClass(node, currentNamespace, useMap, sourceCode, file) {
    const className = node.name && (typeof node.name === 'string' ? node.name : node.name.name);
    if (!className) return null; // skip anonymous classes

    const fqcn = currentNamespace ? `${currentNamespace}\\${className}` : className;
    const doc = extractLeadingDoc(node);
    const extendsRaw = normalizeTypeString(node.extends);
    const extendsFqcn = extendsRaw ? resolveTypeName(extendsRaw, currentNamespace, useMap, fqcn) : null;

    const implementsFqcns = Array.isArray(node.implements)
      ? node.implements
          .map(i => normalizeTypeString(i))
          .filter(Boolean)
          .map(i => resolveTypeName(i, currentNamespace, useMap, fqcn))
      : [];

    const traitFqcns = [];
    const traits = [];
    const methods = [];
    const propertyTypes = {};
    const dependencies = new Set();
    const constructorDeps = new Set();

    let tableName = null;
    let isOrmEntity = false;
    const ormJoinColumns = [];
    const ormColumns = [];

    if (doc) {
      if (doc.includes('@ORM\\Entity') || doc.includes('@ORM\\Table')) {
        isOrmEntity = true;
        const tableMatch = doc.match(/@ORM\\Table\s*\([^)]*name\s*=\s*["']([^"']+)["']/);
        if (tableMatch) tableName = tableMatch[1];
      }
    }
    if (!isOrmEntity && Array.isArray(node.attrGroups)) {
      for (const ag of node.attrGroups) {
        for (const attr of ag.attrs || []) {
          const an = normalizeTypeString(attr.name);
          if (/ORM\\(Entity|Table)$/i.test(an) || an === 'Entity' || an === 'Table') {
            isOrmEntity = true;
            if (/Table$/i.test(an) && Array.isArray(attr.args)) {
              for (const arg of attr.args) {
                if (arg.name === 'name' && arg.value && arg.value.kind === 'string') {
                  tableName = arg.value.value;
                }
              }
            }
          }
        }
      }
    }

    const coversDefaultRaw = parseCoversDefaultClass(doc);
    const coversDefaultFqcn = coversDefaultRaw ? resolveTypeName(coversDefaultRaw, currentNamespace, useMap, fqcn) : null;
    const classCovers = parseCoversTags(doc);

    if (Array.isArray(node.body)) {
      for (const member of node.body) {
        if (!member) continue;

        if (member.kind === 'traituse' && Array.isArray(member.traits)) {
          for (const t of member.traits) {
            const rawTrait = normalizeTypeString(t);
            if (!rawTrait) continue;
            traits.push(rawTrait);
            const tFqcn = resolveTypeName(rawTrait, currentNamespace, useMap, fqcn);
            if (tFqcn) traitFqcns.push(tFqcn);
          }
        }

        if (member.kind === 'propertystatement' && Array.isArray(member.properties)) {
          const propDoc = extractLeadingDoc(member);
          let docVarType = null;
          const varMatch = propDoc.match(/@var\s+([^\s|*]+)(?:\|null)?/);
          if (varMatch && !BUILTIN_SCALARS.has(varMatch[1].toLowerCase())) {
            docVarType = resolveTypeName(varMatch[1], currentNamespace, useMap, fqcn);
          }

          const hasJoinColumn = propDoc.includes('@ORM\\JoinColumn');
          const jcMatch = hasJoinColumn ? propDoc.match(/@ORM\\JoinColumn\s*\(([^)]+)\)/) : null;
          const jcNameMatch = jcMatch ? jcMatch[1].match(/\bname\s*=\s*["']([^"']+)["']/) : null;
          const jcRefMatch = jcMatch ? jcMatch[1].match(/\breferencedColumnName\s*=\s*["']([^"']+)["']/) : null;
          const targetMatch = propDoc.match(/@ORM\\(?:ManyToOne|OneToOne|ManyToMany)\s*\([^)]*targetEntity\s*=\s*([^,\s)]+)/);

          const colMatch = propDoc.match(/@ORM\\Column\s*\(([^)]*)\)/);
          const colAttrsRaw = colMatch ? colMatch[1] : '';
          const colNameMatch = colAttrsRaw.match(/\bname\s*=\s*["']([^"']+)["']/);
          const colTypeMatch = colAttrsRaw.match(/\btype\s*=\s*["']([^"']+)["']/);
          const colNullableMatch = colAttrsRaw.match(/\bnullable\s*=\s*(true|false)/i);
          const isOrmId = /@ORM\\Id\b/.test(propDoc);

          for (const prop of member.properties) {
            const propName = prop.name && (typeof prop.name === 'string' ? prop.name : prop.name.name);
            const rawPropType = normalizeTypeString(prop.type) || normalizeTypeString(member.type);
            const resolvedPropType = rawPropType && !BUILTIN_SCALARS.has(rawPropType.toLowerCase())
              ? resolveTypeName(rawPropType, currentNamespace, useMap, fqcn)
              : docVarType;

            if (jcMatch && propName) {
              const targetRaw = targetMatch ? targetMatch[1].replace(/::class|["']/g, '') : null;
              ormJoinColumns.push({
                property: propName,
                columnName: jcNameMatch ? jcNameMatch[1] : null,
                referencedColumnName: jcRefMatch ? jcRefMatch[1] : null,
                targetFqcn: targetRaw ? resolveTypeName(targetRaw, currentNamespace, useMap, fqcn) : null,
                raw: jcMatch[1],
                targetEntityRaw: targetRaw
              });
            }

            if (isOrmEntity && propName && (colMatch || jcMatch)) {
              const colName = colNameMatch
                ? colNameMatch[1]
                : (jcNameMatch ? jcNameMatch[1] : null);
              if (colName) {
                ormColumns.push({
                  propertyName: propName,
                  columnName: colName.toLowerCase(),
                  dataType: colTypeMatch ? colTypeMatch[1].toLowerCase() : (jcMatch ? 'integer' : (rawPropType || 'string').toLowerCase()),
                  nullable: colNullableMatch ? colNullableMatch[1].toLowerCase() === 'true' : (isOrmId ? false : false),
                  isPk: isOrmId,
                  isFk: Boolean(jcMatch)
                });
              }
            }

            if (propName && resolvedPropType && !BUILTIN_SCALARS.has(resolvedPropType.toLowerCase())) {
              propertyTypes[propName] = resolvedPropType;
              dependencies.add(resolvedPropType);
            }
          }
        }

        if (member.kind === 'method') {
          const extractedMethod = this._extractMethod(member, fqcn, currentNamespace, useMap, file, sourceCode);
          methods.push(extractedMethod);
          if (extractedMethod.name === '__construct') {
            for (const p of extractedMethod.parameters) {
              if (p.type_fqcn && !BUILTIN_SCALARS.has(p.type_fqcn.toLowerCase())) {
                constructorDeps.add(p.type_fqcn);
                dependencies.add(p.type_fqcn);
              }
            }
          }
        }
      }
    }

    const classFingerprint = sha256Hex({
      kind: 'Class',
      fqcn,
      namespace: currentNamespace,
      extends_fqcn: extendsFqcn,
      implements: [...implementsFqcns].sort(),
      traits: [...traitFqcns].sort(),
      property_types: propertyTypes,
      constructor_deps: [...constructorDeps].sort(),
      isOrmEntity,
      tableName,
      methods: methods.map((m) => [m.signature, m.content_fingerprint]).sort()
    });

    return {
      kind: 'Class',
      name: className,
      fqcn,
      namespace: currentNamespace,
      extends: extendsRaw,
      extends_fqcn: extendsFqcn,
      implements: implementsFqcns,
      traits,
      trait_fqcns: traitFqcns,
      property_types: propertyTypes,
      constructor_deps: Array.from(constructorDeps),
      dependencies: Array.from(dependencies),
      methods,
      isOrmEntity,
      tableName,
      ormJoinColumns,
      ormColumns,
      coversDefaultFqcn,
      classCovers,
      useMap,
      content_fingerprint: classFingerprint,
      source_file: file,
      line_start: node.loc ? node.loc.start.line : 0,
      line_end: node.loc ? node.loc.end.line : 0
    };
  }

  _extractInterface(node, currentNamespace, useMap, file) {
    const name = node.name && (typeof node.name === 'string' ? node.name : node.name.name);
    if (!name) return null;
    const fqcn = currentNamespace ? `${currentNamespace}\\${name}` : name;
    const extendsFqcns = Array.isArray(node.extends)
      ? node.extends.map(e => normalizeTypeString(e)).filter(Boolean).map(e => resolveTypeName(e, currentNamespace, useMap, fqcn))
      : [];
    const methods = [];
    if (Array.isArray(node.body)) {
      for (const member of node.body) {
        if (member && member.kind === 'method') {
          methods.push(this._extractMethod(member, fqcn, currentNamespace, useMap, file, ''));
        }
      }
    }
    const ifaceFingerprint = sha256Hex({
      kind: 'Interface',
      fqcn,
      namespace: currentNamespace,
      extends: [...extendsFqcns].sort(),
      methods: methods.map((m) => [m.signature, m.content_fingerprint]).sort()
    });

    return {
      kind: 'Interface',
      name,
      fqcn,
      namespace: currentNamespace,
      extends: extendsFqcns,
      methods,
      content_fingerprint: ifaceFingerprint,
      source_file: file,
      line_start: node.loc ? node.loc.start.line : 0,
      line_end: node.loc ? node.loc.end.line : 0
    };
  }

  _extractTrait(node, currentNamespace, useMap, file) {
    const name = node.name && (typeof node.name === 'string' ? node.name : node.name.name);
    if (!name) return null;
    const fqcn = currentNamespace ? `${currentNamespace}\\${name}` : name;
    const traitFqcns = [];
    const propertyTypes = {};
    const methods = [];

    if (Array.isArray(node.body)) {
      for (const member of node.body) {
        if (!member) continue;
        if (member.kind === 'traituse' && Array.isArray(member.traits)) {
          for (const t of member.traits) {
            const raw = normalizeTypeString(t);
            if (raw) traitFqcns.push(resolveTypeName(raw, currentNamespace, useMap, fqcn));
          }
        }
        if (member.kind === 'propertystatement' && Array.isArray(member.properties)) {
          for (const prop of member.properties) {
            const propName = prop.name && (typeof prop.name === 'string' ? prop.name : prop.name.name);
            const rawType = normalizeTypeString(prop.type) || normalizeTypeString(member.type);
            if (propName && rawType && !BUILTIN_SCALARS.has(rawType.toLowerCase())) {
              propertyTypes[propName] = resolveTypeName(rawType, currentNamespace, useMap, fqcn);
            }
          }
        }
        if (member.kind === 'method') {
          methods.push(this._extractMethod(member, fqcn, currentNamespace, useMap, file, ''));
        }
      }
    }

    const traitFingerprint = sha256Hex({
      kind: 'Trait',
      fqcn,
      namespace: currentNamespace,
      traits: [...traitFqcns].sort(),
      property_types: propertyTypes,
      methods: methods.map((m) => [m.signature, m.content_fingerprint]).sort()
    });

    return {
      kind: 'Trait',
      name,
      fqcn,
      namespace: currentNamespace,
      trait_fqcns: traitFqcns,
      property_types: propertyTypes,
      methods,
      useMap,
      content_fingerprint: traitFingerprint,
      source_file: file,
      line_start: node.loc ? node.loc.start.line : 0,
      line_end: node.loc ? node.loc.end.line : 0
    };
  }

  _extractMethod(node, classFqcn, currentNamespace, useMap, file, sourceCode = '') {
    const methodName = node.name && (typeof node.name === 'string' ? node.name : node.name.name);
    const signature = `${classFqcn}::${methodName}`;
    const visibility = node.visibility || 'public';
    const isStatic = !!node.isStatic;
    const params = [];
    const localVarTypes = {};

    const doc = extractLeadingDoc(node);
    const coversTags = parseCoversTags(doc);
    let docReturnFqcn = null;
    if (doc) {
      const retMatch = doc.match(/@return\s+([^\s|*]+)(?:\|null|\[\])?/);
      if (retMatch && !BUILTIN_SCALARS.has(retMatch[1].toLowerCase())) {
        const cleanRet = retMatch[1].replace(/\[\]$/, '');
        if (!BUILTIN_SCALARS.has(cleanRet.toLowerCase())) {
          docReturnFqcn = resolveTypeName(cleanRet, currentNamespace, useMap, classFqcn);
        }
      }
    }

    if (Array.isArray(node.arguments)) {
      for (const arg of node.arguments) {
        const argName = arg.name && (typeof arg.name === 'string' ? arg.name : arg.name.name);
        const rawType = normalizeTypeString(arg.type);
        const typeFqcn = rawType && !BUILTIN_SCALARS.has(rawType.toLowerCase())
          ? resolveTypeName(rawType, currentNamespace, useMap, classFqcn)
          : null;
        params.push({
          name: argName,
          type: rawType,
          type_fqcn: typeFqcn,
          nullable: !!arg.nullable
        });
        if (argName && typeFqcn) {
          localVarTypes[argName] = { kind: 'STATIC_TYPE', fqcn: typeFqcn };
        }
      }
    }

    const rawRetType = normalizeTypeString(node.type);
    const returnTypeFqcn = rawRetType && !BUILTIN_SCALARS.has(rawRetType.toLowerCase())
      ? resolveTypeName(rawRetType, currentNamespace, useMap, classFqcn)
      : docReturnFqcn;

    const calls = [];
    const rawCalls = [];
    const instantiations = [];
    const mockTargets = [];
    const propertyAssignments = [];
    const reads = [];
    const writes = [];
    const dqlHints = [];
    const eventHints = [];

    if (node.body) {
      this._scanDocCommentsForVars(node.body, currentNamespace, useMap, classFqcn, localVarTypes);
      this._traverseMethodBody(node.body, {
        classFqcn,
        currentNamespace,
        useMap,
        localVarTypes,
        calls,
        rawCalls,
        instantiations,
        mockTargets,
        propertyAssignments,
        reads,
        writes,
        dqlHints,
        eventHints
      });
    }

    const signatureHash = sha256Hex({
      signature,
      visibility,
      is_static: isStatic,
      parameters: params,
      return_type: rawRetType || null,
      return_type_fqcn: returnTypeFqcn || null
    });
    const bodyHash = node.body
      ? hashAstNode(node.body)
      : sha256Hex({ abstractOrInterface: true, signatureHash });
    const contentFingerprint = sha256Hex({ signatureHash, bodyHash });

    return {
      name: methodName,
      signature,
      class_fqcn: classFqcn,
      namespace: currentNamespace,
      visibility,
      is_static: isStatic,
      parameters: params,
      return_type: rawRetType,
      return_type_fqcn: returnTypeFqcn,
      signature_hash: signatureHash,
      body_hash: bodyHash,
      content_fingerprint: contentFingerprint,
      localVarTypes,
      calls,
      rawCalls,
      instantiations,
      mockTargets,
      propertyAssignments,
      reads,
      writes,
      dqlHints,
      eventHints,
      coversTags,
      source_file: file,
      line_start: node.loc ? node.loc.start.line : 0,
      line_end: node.loc ? node.loc.end.line : 0
    };
  }

  _scanDocCommentsForVars(node, ns, useMap, selfFqcn, localVarTypes) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node.leadingComments)) {
      for (const c of node.leadingComments) {
        const m = String(c.value || '').match(/@var\s+([^\s|*]+)\s+\$([a-zA-Z0-9_]+)/);
        if (m && !BUILTIN_SCALARS.has(m[1].toLowerCase())) {
          const fqcn = resolveTypeName(m[1], ns, useMap, selfFqcn);
          if (fqcn) localVarTypes[m[2]] = { kind: 'STATIC_TYPE', fqcn };
        }
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'leadingComments' || k === 'trailingComments' || k === 'loc') continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach(item => this._scanDocCommentsForVars(item, ns, useMap, selfFqcn, localVarTypes));
      else if (v && typeof v === 'object') this._scanDocCommentsForVars(v, ns, useMap, selfFqcn, localVarTypes);
    }
  }

  _extractClassConstFqcn(argNode, ctx) {
    if (!argNode) return null;
    if (argNode.kind === 'classreference' || argNode.kind === 'name') {
      const raw = normalizeTypeString(argNode);
      return raw ? resolveTypeName(raw, ctx.currentNamespace, ctx.useMap, ctx.classFqcn) : null;
    }
    if (argNode.kind === 'staticlookup' && argNode.offset && argNode.offset.name === 'class') {
      const raw = normalizeTypeString(argNode.what);
      return raw ? resolveTypeName(raw, ctx.currentNamespace, ctx.useMap, ctx.classFqcn) : null;
    }
    return null;
  }

  _inferExprDescriptor(expr, ctx) {
    if (!expr || typeof expr !== 'object') return null;

    if (expr.kind === 'variable' && typeof expr.name === 'string') {
      if (expr.name === 'this') return { kind: 'THIS' };
      return { kind: 'VAR', varName: expr.name };
    }

    if (expr.kind === 'new') {
      const rawCls = normalizeTypeString(expr.what);
      const fqcn = rawCls ? resolveTypeName(rawCls, ctx.currentNamespace, ctx.useMap, ctx.classFqcn) : null;
      if (fqcn) return { kind: 'STATIC_TYPE', fqcn };
    }

    if (expr.kind === 'propertylookup') {
      const owner = this._inferExprDescriptor(expr.what, ctx);
      const prop = expr.offset ? (expr.offset.name || null) : null;
      if (owner && prop) return { kind: 'PROP', owner, prop };
    }

    if (expr.kind === 'call') {
      const target = this._buildCallDescriptor(expr, ctx);
      if (target) {
        if (target.kind === 'MOCK_SUT' || target.kind === 'API_MOCK') {
          return { kind: 'STATIC_TYPE', fqcn: target.targetFqcn };
        }
        return { kind: 'CALL_RESULT', call: target };
      }
    }

    if (expr.kind === 'staticlookup') {
      const rawCls = normalizeTypeString(expr.what);
      const clsFqcn = rawCls ? resolveTypeName(rawCls, ctx.currentNamespace, ctx.useMap, ctx.classFqcn) : null;
      const member = expr.offset ? expr.offset.name : null;
      if (clsFqcn === 'OrangeHRM\\ORM\\Doctrine' && member === 'getEntityManager') {
        return { kind: 'STATIC_TYPE', fqcn: 'Doctrine\\ORM\\EntityManager' };
      }
    }

    return null;
  }

  _buildCallDescriptor(callNode, ctx) {
    if (!callNode || callNode.kind !== 'call' || !callNode.what) return null;
    const args = Array.isArray(callNode.arguments) ? callNode.arguments : [];

    // 1. Instance / Chained call: `<expr>->methodName(...)`
    if (callNode.what.kind === 'propertylookup') {
      const methodName = callNode.what.offset ? (callNode.what.offset.name || null) : null;
      if (!methodName) return null;

      // Special PHPUnit mock patterns:
      // - `$this->createMock(Foo::class)`
      // - `$this->getApiEndpointMock(FooAPI::class, ...)`
      // - `$this->getMockBuilder(Foo::class)->onlyMethods([...])->getMock()`
      if ((methodName === 'createMock' || methodName === 'createPartialMock' || methodName === 'getApiEndpointMock' || methodName === 'getMockBuilder') && args.length > 0) {
        const mockedFqcn = this._extractClassConstFqcn(args[0], ctx);
        if (mockedFqcn) {
          const isPartialOrApi = methodName !== 'createMock';
          return {
            kind: methodName === 'getApiEndpointMock' ? 'API_MOCK' : 'MOCK_SUT',
            mockMethod: methodName,
            targetFqcn: mockedFqcn,
            isPartial: isPartialOrApi,
            methodName,
            receiver: { kind: 'THIS' }
          };
        }
      }

      if (methodName === 'getMock' || methodName === 'onlyMethods' || methodName === 'setMethods' || methodName === 'disableOriginalConstructor') {
        const inner = this._inferExprDescriptor(callNode.what.what, ctx);
        if (inner && inner.kind === 'CALL_RESULT' && inner.call && inner.call.targetFqcn) {
          return {
            ...inner.call,
            onlyMethods: methodName === 'onlyMethods' ? this._extractStringArray(args[0]) : inner.call.onlyMethods,
            isPartial: inner.call.isPartial || methodName === 'onlyMethods'
          };
        }
        if (inner && inner.kind === 'STATIC_TYPE') {
          return {
            kind: 'MOCK_SUT',
            mockMethod: methodName,
            targetFqcn: inner.fqcn,
            isPartial: methodName === 'onlyMethods',
            methodName
          };
        }
      }

      const receiver = this._inferExprDescriptor(callNode.what.what, ctx);
      return {
        kind: 'INSTANCE',
        receiver,
        methodName,
        argsCount: args.length,
        argsPreview: args
      };
    }

    // 2. Static call: `ClassName::methodName(...)`, `self::`, `static::`, `parent::`
    if (callNode.what.kind === 'staticlookup') {
      const rawCls = normalizeTypeString(callNode.what.what);
      const methodName = callNode.what.offset ? (callNode.what.offset.name || null) : null;
      if (!rawCls || !methodName) return null;

      let callSubKind = 'STATIC';
      let targetFqcn = null;
      const lower = rawCls.toLowerCase();
      if (lower === 'self' || lower === 'static') {
        callSubKind = lower === 'self' ? 'SELF' : 'STATIC_SELF';
        targetFqcn = ctx.classFqcn;
      } else if (lower === 'parent') {
        callSubKind = 'PARENT';
      } else {
        targetFqcn = resolveTypeName(rawCls, ctx.currentNamespace, ctx.useMap, ctx.classFqcn);
      }

      return {
        kind: callSubKind,
        rawClass: rawCls,
        targetFqcn,
        methodName,
        argsCount: args.length,
        argsPreview: args
      };
    }

    // 3. Global function call
    if (callNode.what.kind === 'identifier') {
      return {
        kind: 'FUNCTION',
        methodName: callNode.what.name,
        argsCount: args.length
      };
    }

    return null;
  }

  _extractStringArray(node) {
    if (!node || node.kind !== 'array' || !Array.isArray(node.items)) return [];
    const out = [];
    for (const it of node.items) {
      if (it && it.value && it.value.kind === 'string') out.push(it.value.value);
    }
    return out;
  }

  _extractDqlOrSqlFromArgs(methodName, args, ctx) {
    if (!Array.isArray(args) || args.length === 0) return;
    const mLower = methodName.toLowerCase();
    for (const a of args) {
      if (a && a.kind === 'string' && a.value) {
        const str = a.value;
        // Entity FQCN reference in DQL or getRepository(Cls::class)
        const entityMatches = str.matchAll(/(OrangeHRM\\(?:[A-Za-z0-9_]+\\)*Entity\\[A-Za-z0-9_]+|OrangeHRM\\[A-Za-z0-9_]+\\Entity\\[A-Za-z0-9_]+)/g);
        for (const em of entityMatches) {
          const isWrite = /\b(UPDATE|DELETE|INSERT)\b/i.test(str);
          ctx.dqlHints.push({
            kind: 'DQL_ENTITY',
            entityFqcn: em[1],
            mode: isWrite ? 'WRITE' : 'READ',
            evidence_type: 'DQL_QUERYBUILDER'
          });
        }
        // Raw SQL tables (ohrm_*, hs_hr_*)
        const sqlTableMatches = str.matchAll(/\b((?:ohrm|hs_hr)_[a-z0-9_]+)\b/gi);
        for (const tm of sqlTableMatches) {
          const isWrite = /\b(INSERT\s+INTO|UPDATE|DELETE\s+FROM|REPLACE\s+INTO|ALTER\s+TABLE|TRUNCATE)\b/i.test(str);
          ctx.dqlHints.push({
            kind: 'RAW_SQL_TABLE',
            tableName: tm[1].toLowerCase(),
            mode: isWrite ? 'WRITE' : 'READ',
            evidence_type: 'RAW_SQL'
          });
        }
      }
      if ((mLower === 'getrepository' || mLower === 'createquerybuilder' || mLower === 'from' || mLower === 'select') && (a && (a.kind === 'staticlookup' || a.kind === 'classreference' || a.kind === 'name'))) {
        const clsFqcn = this._extractClassConstFqcn(a, ctx);
        if (clsFqcn) {
          ctx.dqlHints.push({
            kind: 'REPOSITORY_ENTITY',
            entityFqcn: clsFqcn,
            mode: 'READ',
            evidence_type: 'DOCTRINE_MAPPING'
          });
        }
      }
    }

    if (mLower === 'persist' || mLower === 'remove' || mLower === 'flush' || mLower === 'save' || mLower === 'insert' || mLower === 'delete' || mLower === 'update') {
      const entityVar = args[0];
      if (entityVar && entityVar.kind === 'variable') {
        const varDesc = ctx.localVarTypes[entityVar.name];
        if (varDesc && varDesc.fqcn) {
          ctx.dqlHints.push({
            kind: 'EM_WRITE',
            entityFqcn: varDesc.fqcn,
            mode: 'WRITE',
            evidence_type: 'DOCTRINE_MAPPING'
          });
        }
      }
    }
  }

  _traverseMethodBody(node, ctx) {
    if (!node || typeof node !== 'object') return;

    // Assignment tracking (`$x = new Foo()`, `$this->svc = new Foo()`, `$x = $this->createMock(Foo::class)`)
    if (node.kind === 'assign') {
      const desc = this._inferExprDescriptor(node.right, ctx);
      if (node.left && node.left.kind === 'variable' && typeof node.left.name === 'string' && desc) {
        ctx.localVarTypes[node.left.name] = desc;
      } else if (node.left && node.left.kind === 'propertylookup' && node.left.what && node.left.what.kind === 'variable' && node.left.what.name === 'this' && desc) {
        const propName = node.left.offset ? node.left.offset.name : null;
        if (propName) {
          ctx.propertyAssignments.push({ propName, desc });
        }
      }
    }

    // Object instantiation (`new Foo()`)
    if (node.kind === 'new') {
      const rawCls = normalizeTypeString(node.what);
      const fqcn = rawCls ? resolveTypeName(rawCls, ctx.currentNamespace, ctx.useMap, ctx.classFqcn) : null;
      if (fqcn && !BUILTIN_SCALARS.has(fqcn.toLowerCase())) {
        ctx.instantiations.push(fqcn);
      }
    }

    // Calls
    if (node.kind === 'call') {
      const callDesc = this._buildCallDescriptor(node, ctx);
      if (callDesc) {
        if (callDesc.kind === 'MOCK_SUT' || callDesc.kind === 'API_MOCK') {
          ctx.mockTargets.push({
            targetFqcn: callDesc.targetFqcn,
            mockMethod: callDesc.mockMethod,
            isPartial: !!callDesc.isPartial,
            onlyMethods: callDesc.onlyMethods || []
          });
        }

        // Handle EndpointIntegrationTestCase::assertValidTestCase($api, 'create', $testCaseParams)
        if (callDesc.kind === 'INSTANCE' && callDesc.methodName === 'assertValidTestCase' && Array.isArray(callDesc.argsPreview) && callDesc.argsPreview.length >= 2) {
          const apiReceiver = this._inferExprDescriptor(callDesc.argsPreview[0], ctx);
          const apiOpNode = callDesc.argsPreview[1];
          const apiMethod = apiOpNode && apiOpNode.kind === 'string' ? apiOpNode.value : null;
          if (apiReceiver && apiMethod) {
            ctx.rawCalls.push({
              kind: 'INSTANCE',
              receiver: apiReceiver,
              methodName: apiMethod,
              argsCount: 1,
              isEndpointAssertion: true
            });
          }
        }

        // Capture event dispatch calls cleanly
        if (callDesc.kind === 'INSTANCE' && (callDesc.methodName === 'dispatch' || callDesc.methodName === 'addSubscriber' || callDesc.methodName === 'addListener')) {
          ctx.eventHints.push({
            methodName: callDesc.methodName,
            args: (callDesc.argsPreview || []).map(a => {
              if (a && a.kind === 'string') return { kind: 'string', value: a.value };
              if (a && a.kind === 'staticlookup') return { kind: 'const', raw: `${normalizeTypeString(a.what)}::${a.offset ? a.offset.name : ''}` };
              if (a && a.kind === 'new') return { kind: 'new', fqcn: resolveTypeName(normalizeTypeString(a.what), ctx.currentNamespace, ctx.useMap, ctx.classFqcn) };
              if (a && a.kind === 'variable') return { kind: 'var', name: a.name };
              return { kind: a ? a.kind : 'unknown' };
            })
          });
        }

        // Strip large AST nodes before saving descriptor
        const cleanDesc = {
          kind: callDesc.kind,
          receiver: callDesc.receiver || null,
          rawClass: callDesc.rawClass || null,
          targetFqcn: callDesc.targetFqcn || null,
          methodName: callDesc.methodName,
          argsCount: callDesc.argsCount || 0
        };
        ctx.rawCalls.push(cleanDesc);

        this._extractDqlOrSqlFromArgs(callDesc.methodName, callDesc.argsPreview, ctx);

        // Legacy lightweight array population for callers inspecting `m.calls`
        ctx.calls.push({
          type: callDesc.kind === 'FUNCTION' ? 'FunctionCall' : (callDesc.kind === 'INSTANCE' ? 'DirectCall' : 'StaticCall'),
          target_object: (callDesc.receiver && callDesc.receiver.kind === 'THIS') ? 'this' : (callDesc.receiver ? callDesc.receiver.varName || callDesc.receiver.kind : null),
          target_class: callDesc.targetFqcn || callDesc.rawClass || null,
          method_name: callDesc.methodName,
          confidence: 0.9,
          evidence_type: 'AST_CALL_ANALYSIS'
        });

        const lower = callDesc.methodName.toLowerCase();
        if (lower.includes('save') || lower.includes('update') || lower.includes('insert') || lower.includes('delete') || lower.includes('persist') || lower.includes('flush')) {
          ctx.writes.push(cleanDesc);
        } else if (lower.includes('get') || lower.includes('find') || lower.includes('search') || lower.includes('list') || lower.includes('count')) {
          ctx.reads.push(cleanDesc);
        }
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments' || key === 'argsPreview') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) this._traverseMethodBody(item, ctx);
      } else if (child && typeof child === 'object') {
        this._traverseMethodBody(child, ctx);
      }
    }
  }
}

module.exports = PhpAstExtractor;
module.exports.resolveTypeName = resolveTypeName;
module.exports.normalizeTypeString = normalizeTypeString;
