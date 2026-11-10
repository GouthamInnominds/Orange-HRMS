/**
 * OrangeHRM QKG PHP AST Extractor
 * Powered by Glayzzle php-parser
 * Extracts Namespaces, Classes, Interfaces, Traits, Methods, Method Calls,
 * Type Dependencies, Trait Usages, and Doctrine ORM Table Mappings.
 */

const fs = require('fs');
const path = require('path');
const { Engine } = require('php-parser');

const parser = new Engine({
  parser: {
    extractDoc: true,
    php7: true
  },
  ast: {
    withPositions: true
  }
});

class PhpAstExtractor {
  constructor(options = {}) {
    this.parserVersion = options.parserVersion || '2.0.0';
    this.commitSha = options.commitSha || '51a2219717d2a3fc7bc6f23696515b22fe791dfd';
  }

  parseFile(filePath, relPath) {
    const code = fs.readFileSync(filePath, 'utf8');
    let ast;
    try {
      ast = parser.parseCode(code, path.basename(filePath));
    } catch (err) {
      console.warn(`[PhpAstExtractor] Syntax error in ${relPath}: ${err.message}`);
      return null;
    }

    const result = {
      file: relPath.replace(/\\/g, '/'),
      classes: [],
      interfaces: [],
      traits: [],
      entities: []
    };

    this._traverse(ast, result, null, code);
    return result;
  }

  _traverse(node, result, currentNamespace = null, sourceCode = '') {
    if (!node || typeof node !== 'object') return;

    if (node.kind === 'namespace') {
      currentNamespace = node.name;
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          this._traverse(child, result, currentNamespace, sourceCode);
        }
      }
      return;
    }

    if (node.kind === 'class') {
      const cls = this._extractClass(node, currentNamespace, sourceCode, result.file);
      result.classes.push(cls);
      if (cls.isOrmEntity) {
        result.entities.push(cls);
      }
    } else if (node.kind === 'interface') {
      result.interfaces.push(this._extractInterface(node, currentNamespace, result.file));
    } else if (node.kind === 'trait') {
      result.traits.push(this._extractTrait(node, currentNamespace, result.file));
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        this._traverse(child, result, currentNamespace, sourceCode);
      }
    }
  }

  _extractClass(node, currentNamespace, sourceCode, file) {
    const className = node.name.name;
    const fqcn = currentNamespace ? `${currentNamespace}\\${className}` : className;
    const extendsClass = node.extends ? node.extends.name : null;
    const implementsInterfaces = node.implements ? node.implements.map(i => i.name) : [];
    
    // Extract traits
    const traits = [];
    const methods = [];
    const dependencies = new Set();
    let tableName = null;
    let isOrmEntity = false;

    // Check DocBlock for ORM annotations
    if (node.leadingComments && node.leadingComments.length > 0) {
      const doc = node.leadingComments.map(c => c.value).join('\n');
      if (doc.includes('@ORM\\Entity') || doc.includes('@ORM\\Table')) {
        isOrmEntity = true;
        const tableMatch = doc.match(/@ORM\\Table\s*\(\s*name\s*=\s*["']([^"']+)["']/);
        if (tableMatch) {
          tableName = tableMatch[1];
        }
      }
    }

    if (Array.isArray(node.body)) {
      for (const member of node.body) {
        // Trait usage: `use TraitName;`
        if (member.kind === 'traituse') {
          for (const t of member.traits) {
            traits.push(t.name);
          }
        }

        // Property type dependency
        if (member.kind === 'propertystatement') {
          for (const prop of member.properties) {
            if (member.type && member.type.name) {
              dependencies.add(member.type.name);
            }
          }
        }

        // Methods
        if (member.kind === 'method') {
          methods.push(this._extractMethod(member, fqcn, file));
        }
      }
    }

    return {
      name: className,
      fqcn: fqcn,
      namespace: currentNamespace,
      extends: extendsClass,
      implements: implementsInterfaces,
      traits: traits,
      dependencies: Array.from(dependencies),
      methods: methods,
      isOrmEntity: isOrmEntity,
      tableName: tableName,
      source_file: file,
      line_start: node.loc ? node.loc.start.line : 0,
      line_end: node.loc ? node.loc.end.line : 0
    };
  }

  _extractInterface(node, currentNamespace, file) {
    const name = node.name.name;
    return {
      name: name,
      fqcn: currentNamespace ? `${currentNamespace}\\${name}` : name,
      namespace: currentNamespace,
      extends: node.extends ? node.extends.map(e => e.name) : [],
      source_file: file
    };
  }

  _extractTrait(node, currentNamespace, file) {
    const name = node.name.name;
    return {
      name: name,
      fqcn: currentNamespace ? `${currentNamespace}\\${name}` : name,
      namespace: currentNamespace,
      source_file: file
    };
  }

  _extractMethod(node, classFqcn, file) {
    const methodName = node.name.name;
    const signature = `${classFqcn}::${methodName}`;
    const visibility = node.visibility || 'public';
    const isStatic = !!node.isStatic;
    const params = [];
    const calls = [];
    const reads = [];
    const writes = [];

    if (Array.isArray(node.arguments)) {
      for (const arg of node.arguments) {
        params.push({
          name: arg.name.name,
          type: arg.type ? arg.type.name : null,
          nullable: arg.nullable || false
        });
      }
    }

    // Traverse method body for calls and read/write semantics
    this._traverseMethodBody(node.body, calls, reads, writes);

    return {
      name: methodName,
      signature: signature,
      class_fqcn: classFqcn,
      visibility: visibility,
      is_static: isStatic,
      parameters: params,
      return_type: node.type ? node.type.name : null,
      calls: calls,
      reads: reads,
      writes: writes,
      source_file: file,
      line_start: node.loc ? node.loc.start.line : 0,
      line_end: node.loc ? node.loc.end.line : 0
    };
  }

  _traverseMethodBody(body, calls, reads, writes) {
    if (!body || typeof body !== 'object') return;

    if (body.kind === 'call') {
      const callTarget = this._resolveCallTarget(body);
      if (callTarget) {
        calls.push(callTarget);
        const nameLower = callTarget.method_name.toLowerCase();
        if (nameLower.includes('save') || nameLower.includes('update') || nameLower.includes('insert') || nameLower.includes('delete') || nameLower.includes('persist') || nameLower.includes('flush')) {
          writes.push(callTarget);
        } else if (nameLower.includes('get') || nameLower.includes('find') || nameLower.includes('search') || nameLower.includes('list') || nameLower.includes('count')) {
          reads.push(callTarget);
        }
      }
    }

    for (const key of Object.keys(body)) {
      if (Array.isArray(body[key])) {
        for (const item of body[key]) {
          this._traverseMethodBody(item, calls, reads, writes);
        }
      } else if (typeof body[key] === 'object') {
        this._traverseMethodBody(body[key], calls, reads, writes);
      }
    }
  }

  _resolveCallTarget(callNode) {
    // 1. Direct call: $this->methodName() or $this->dao->methodName()
    if (callNode.what && callNode.what.kind === 'propertylookup') {
      const prop = callNode.what.offset ? callNode.what.offset.name : null;
      const targetObj = callNode.what.what ? (callNode.what.what.name || callNode.what.what.kind) : null;
      if (prop) {
        return {
          type: 'DirectCall',
          target_object: targetObj,
          method_name: prop,
          confidence: 0.9,
          evidence_type: 'AST'
        };
      }
    }

    // 2. Static call: Class::methodName()
    if (callNode.what && callNode.what.kind === 'staticlookup') {
      const cls = callNode.what.what ? callNode.what.what.name : null;
      const mtd = callNode.what.offset ? callNode.what.offset.name : null;
      if (cls && mtd) {
        return {
          type: 'StaticCall',
          target_class: cls,
          method_name: mtd,
          confidence: 1.0,
          evidence_type: 'AST'
        };
      }
    }

    // 3. Simple function call: func()
    if (callNode.what && callNode.what.kind === 'identifier') {
      return {
        type: 'FunctionCall',
        method_name: callNode.what.name,
        confidence: 1.0,
        evidence_type: 'AST'
      };
    }

    return null;
  }
}

module.exports = PhpAstExtractor;
