/**
 * OrangeHRM QKG Vue & TypeScript Frontend AST Extractor
 * Extracts all UI Components, Pages, Form Input Fields, Child Components,
 * and API Endpoint Calls across the entire client codebase (orange_hrm/src/client/src).
 */

const fs = require('fs');
const path = require('path');

class VueAstExtractor {
  constructor(clientSrcDir) {
    this.clientSrcDir = clientSrcDir;
  }

  extractAll() {
    const components = [];
    const pages = [];
    const apiCallMap = [];

    // 1. Scan and register Pages from pages.ts and plugin index.ts
    const pageIndexFiles = this._findPluginIndexFiles();
    for (const pFile of pageIndexFiles) {
      const pageEntries = this._parsePageIndex(pFile);
      pages.push(...pageEntries);
    }

    // 2. Scan all .vue files
    const vueFiles = this._findFiles(this.clientSrcDir, '.vue');
    for (const vFile of vueFiles) {
      const comp = this._parseVueFile(vFile);
      if (comp) {
        components.push(comp);
      }
    }

    // 3. Scan all .ts files (services, composables, utilities)
    const tsFiles = this._findFiles(this.clientSrcDir, '.ts').filter(f => !f.endsWith('.d.ts'));
    for (const tFile of tsFiles) {
      const tsMod = this._parseTsFile(tFile);
      if (tsMod) {
        components.push(tsMod);
      }
    }

    return { components, pages };
  }

  _findFiles(dir, ext) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.yarn') {
        results.push(...this._findFiles(full, ext));
      } else if (item.name.endsWith(ext)) {
        results.push(full);
      }
    }
    return results;
  }

  _findPluginIndexFiles() {
    const indexFiles = [];
    for (const item of fs.readdirSync(this.clientSrcDir, { withFileTypes: true })) {
      if (item.isDirectory() && (item.name.startsWith('orangehrm') || item.name === 'core')) {
        const idx = path.join(this.clientSrcDir, item.name, 'index.ts');
        if (fs.existsSync(idx)) {
          indexFiles.push(idx);
        }
      }
    }
    return indexFiles;
  }

  _parsePageIndex(indexPath) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const pluginName = path.basename(path.dirname(indexPath));
    const pages = [];

    // Match imports: import SaveEmployee from './pages/employee/SaveEmployee.vue';
    const importMap = {};
    const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = importRegex.exec(content)) !== null) {
      importMap[m[1]] = m[2];
    }

    // Match exports: 'employee-save': SaveEmployee
    const exportRegex = /['"]([a-zA-Z0-9_\-]+)['"]\s*:\s*([A-Za-z0-9_]+)/g;
    while ((m = exportRegex.exec(content)) !== null) {
      const pageKey = m[1];
      const compVar = m[2];
      const compPath = importMap[compVar] || null;
      pages.push({
        page_id: pageKey,
        plugin: pluginName,
        component_name: compVar,
        component_relative_path: compPath,
        source_file: path.relative(path.resolve(this.clientSrcDir, '..', '..'), indexPath).replace(/\\/g, '/')
      });
    }

    return pages;
  }

  _parseVueFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.vue');
    const relPath = path.relative(path.resolve(this.clientSrcDir, '..', '..'), filePath).replace(/\\/g, '/');

    // Extract plugin name from path (e.g. client/src/orangehrmPimPlugin/...)
    const parts = relPath.split('/');
    const srcIndex = parts.indexOf('src');
    const plugin = (srcIndex !== -1 && parts[srcIndex + 1]) ? parts[srcIndex + 1] : 'core';

    // 1. Component name from script
    let compName = filename;
    const nameMatch = content.match(/name\s*:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      compName = nameMatch[1];
    }

    // 2. Extract inputs (v-model="...")
    const inputs = [];
    const vmodelRegex = /v-model(?::[a-zA-Z0-9_]+)?\s*=\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = vmodelRegex.exec(content)) !== null) {
      inputs.push(match[1]);
    }

    // 3. Extract child components from template
    const childComponents = new Set();
    const tagRegex = /<([a-z0-9]+-[a-z0-9\-]+)/g;
    while ((match = tagRegex.exec(content)) !== null) {
      childComponents.add(match[1]);
    }

    // 4. Extract API calls (URLs and http helper calls)
    const apiCalls = new Set();
    
    // Explicit API urls
    const urlRegex = /['"](\/api\/v2\/[^'"]+)['"]/g;
    while ((match = urlRegex.exec(content)) !== null) {
      apiCalls.add(match[1]);
    }

    // HTTP method invocations: this.http.create(), this.http.getAll(), etc.
    const httpMethods = [];
    const httpRegex = /this\.http\.([a-zA-Z0-9_]+)\s*\(/g;
    while ((match = httpRegex.exec(content)) !== null) {
      httpMethods.push(match[1]);
    }

    return {
      type: 'VueComponent',
      name: compName,
      component_id: `VUE_${plugin.toUpperCase()}_${compName.toUpperCase()}`,
      file: relPath,
      plugin: plugin,
      inputs: Array.from(new Set(inputs)),
      child_components: Array.from(childComponents),
      api_calls: Array.from(apiCalls),
      http_methods: Array.from(new Set(httpMethods)),
      line_count: content.split('\n').length
    };
  }

  _parseTsFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.ts');
    const relPath = path.relative(path.resolve(this.clientSrcDir, '..', '..'), filePath).replace(/\\/g, '/');

    const parts = relPath.split('/');
    const srcIndex = parts.indexOf('src');
    const plugin = (srcIndex !== -1 && parts[srcIndex + 1]) ? parts[srcIndex + 1] : 'core';

    // Extract API calls
    const apiCalls = new Set();
    const urlRegex = /['"](\/api\/v2\/[^'"]+)['"]/g;
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      apiCalls.add(match[1]);
    }

    // Exported symbols
    const exports = [];
    const exportRegex = /export\s+(?:default|const|class|function|interface|type)\s+([A-Za-z0-9_]+)/g;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    return {
      type: 'TypeScriptModule',
      name: filename,
      component_id: `TS_${plugin.toUpperCase()}_${filename.toUpperCase()}`,
      file: relPath,
      plugin: plugin,
      inputs: [],
      child_components: [],
      api_calls: Array.from(apiCalls),
      exports: exports,
      line_count: content.split('\n').length
    };
  }
}

module.exports = VueAstExtractor;
