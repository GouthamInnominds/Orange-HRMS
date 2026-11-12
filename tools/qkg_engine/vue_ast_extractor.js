/**
 * OrangeHRM QKG Vue & TypeScript Frontend AST Extractor
 * Extracts UI Components, TS Modules, Registered Pages, Form Inputs,
 * Route Permission Keys, and Normalized REST API Endpoint Calls.
 */

const fs = require('fs');
const path = require('path');
const { toRepoRelPath, extractPluginFromPath } = require('./qkg_config');
const { sha256Hex } = require('./canonical_hash');

function normalizeUrlPattern(urlStr) {
  if (!urlStr) return null;
  let norm = urlStr.trim();
  // Convert `${var}` inside template literals into wildcard placeholder `{*}`
  norm = norm.replace(/\$\{[^}]+\}/g, '{*}');
  // Strip query string
  norm = norm.split('?')[0];
  return norm.replace(/\/+$/, '') || '/';
}

class VueAstExtractor {
  constructor(clientSrcDir) {
    this.clientSrcDir = clientSrcDir;
  }

  extractAll() {
    const components = [];
    const pages = [];

    const pageIndexFiles = this._findPluginIndexFiles();
    for (const pFile of pageIndexFiles) {
      pages.push(...this._parsePageIndex(pFile));
    }

    const pathByComp = new Map();
    const vueFiles = this._findFiles(this.clientSrcDir, '.vue');
    for (const vFile of vueFiles) {
      const comp = this._parseVueFile(vFile);
      if (comp) {
        components.push(comp);
        pathByComp.set(comp, vFile);
      }
    }

    const tsFiles = this._findFiles(this.clientSrcDir, '.ts')
      .filter(f => !f.endsWith('.d.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.test.ts'));
    for (const tFile of tsFiles) {
      const tsMod = this._parseTsFile(tFile);
      if (tsMod) {
        components.push(tsMod);
        pathByComp.set(tsMod, tFile);
      }
    }

    components.sort((a, b) => String(a.file || '').localeCompare(String(b.file || '')));
    pages.sort((a, b) => `${a.plugin || ''}:${a.page_id || ''}`.localeCompare(`${b.plugin || ''}:${b.page_id || ''}`));

    const idCounts = new Map();
    for (const comp of components) {
      idCounts.set(comp.component_id, (idCounts.get(comp.component_id) || 0) + 1);
    }
    const seenIds = new Set();
    for (const comp of components) {
      if ((idCounts.get(comp.component_id) || 0) > 1) {
        const prefix = comp.type === 'TypeScriptModule' ? 'TS' : 'VUE';
        const dirSlug = path.basename(path.dirname(comp.file || ''))
          .replace(/[^A-Za-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '')
          .toUpperCase() || 'ROOT';
        const base = `${prefix}_${String(comp.plugin || 'core').toUpperCase()}_${dirSlug}_${String(comp.name || 'COMPONENT').toUpperCase()}`;
        let candidate = base;
        let suffix = 2;
        while (seenIds.has(candidate)) {
          candidate = `${base}_${suffix++}`;
        }
        comp.component_id = candidate;
        const absPath = pathByComp.get(comp);
        if (absPath && fs.existsSync(absPath)) {
          const rawContent = fs.readFileSync(absPath, 'utf8');
          comp.content_fingerprint = sha256Hex({
            type: comp.type,
            component_id: comp.component_id,
            file: comp.file,
            source_hash: sha256Hex(rawContent)
          });
        }
      }
      seenIds.add(comp.component_id);
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
    if (!fs.existsSync(this.clientSrcDir)) return indexFiles;
    for (const item of fs.readdirSync(this.clientSrcDir, { withFileTypes: true })) {
      if (item.isDirectory() && (item.name.startsWith('orangehrm') || item.name === 'core')) {
        const idx = path.join(this.clientSrcDir, item.name, 'index.ts');
        if (fs.existsSync(idx)) indexFiles.push(idx);
      }
    }
    return indexFiles;
  }

  _parsePageIndex(indexPath) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const pluginName = path.basename(path.dirname(indexPath));
    const indexDir = path.dirname(indexPath);
    const pages = [];

    const importMap = {};
    const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = importRegex.exec(content)) !== null) {
      importMap[m[1]] = m[2];
    }

    const exportRegex = /['"]([a-zA-Z0-9_\-]+)['"]\s*:\s*([A-Za-z0-9_]+)/g;
    while ((m = exportRegex.exec(content)) !== null) {
      const pageKey = m[1];
      const compVar = m[2];
      const compPath = importMap[compVar] || null;
      let targetFile = null;
      if (compPath && compPath.startsWith('.')) {
        targetFile = toRepoRelPath(path.resolve(indexDir, compPath));
      }
      pages.push({
        page_id: pageKey,
        plugin: pluginName,
        component_name: compVar,
        component_relative_path: compPath,
        target_file: targetFile,
        source_file: toRepoRelPath(indexPath)
      });
    }

    return pages;
  }

  _extractApiCallsAndRouteRefs(content) {
    const apiCalls = new Set();
    let match;

    const urlRegex = /['"`](\/api\/v2\/[^'"`\s]+|\/payroll\/[^'"`\s]+)['"`]/g;
    while ((match = urlRegex.exec(content)) !== null) {
      const norm = normalizeUrlPattern(match[1]);
      if (norm) apiCalls.add(norm);
    }

    const routeRefRegex = /(?:canRead|canCreate|canUpdate|canDelete)\(\s*['"]([a-zA-Z0-9_\-]+)['"]/g;
    const routeRefs = new Set();
    while ((match = routeRefRegex.exec(content)) !== null) {
      routeRefs.add(match[1]);
    }

    return {
      api_calls: Array.from(apiCalls),
      route_refs: Array.from(routeRefs)
    };
  }

  _parseVueFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.vue');
    const relPath = toRepoRelPath(filePath);
    const plugin = extractPluginFromPath(relPath) || 'core';

    // Derive component identity strictly from filename so object property keys
    // (e.g. `{ name: 'punchIn' }`) or copy-pasted `<script>` `name:` blocks never collide.
    const compName = filename;

    const inputs = [];
    const vmodelRegex = /v-model(?::[a-zA-Z0-9_]+)?\s*=\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = vmodelRegex.exec(content)) !== null) {
      inputs.push(match[1]);
    }

    const childComponents = new Set();
    const tagRegex = /<([a-z0-9]+-[a-z0-9\-]+)/g;
    while ((match = tagRegex.exec(content)) !== null) {
      childComponents.add(match[1]);
    }

    const httpMethods = [];
    const httpRegex = /this\.http\.([a-zA-Z0-9_]+)\s*\(/g;
    while ((match = httpRegex.exec(content)) !== null) {
      httpMethods.push(match[1]);
    }

    const { api_calls, route_refs } = this._extractApiCallsAndRouteRefs(content);

    const inputsList = Array.from(new Set(inputs)).sort();
    const childList = Array.from(childComponents).sort();
    const httpList = Array.from(new Set(httpMethods)).sort();
    const contentFingerprint = sha256Hex({
      type: 'VueComponent',
      component_id: `VUE_${plugin.toUpperCase()}_${compName.toUpperCase()}`,
      file: relPath,
      source_hash: sha256Hex(content)
    });

    return {
      type: 'VueComponent',
      name: compName,
      component_id: `VUE_${plugin.toUpperCase()}_${compName.toUpperCase()}`,
      file: relPath,
      plugin,
      inputs: inputsList,
      child_components: childList,
      api_calls,
      route_refs,
      http_methods: httpList,
      content_fingerprint: contentFingerprint,
      line_count: content.split('\n').length
    };
  }

  _parseTsFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.ts');
    const relPath = toRepoRelPath(filePath);
    const plugin = extractPluginFromPath(relPath) || 'core';

    const exports = [];
    const exportRegex = /export\s+(?:default|const|class|function|interface|type)\s+([A-Za-z0-9_]+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    const { api_calls, route_refs } = this._extractApiCallsAndRouteRefs(content);
    const contentFingerprint = sha256Hex({
      type: 'TypeScriptModule',
      component_id: `TS_${plugin.toUpperCase()}_${filename.toUpperCase()}`,
      file: relPath,
      source_hash: sha256Hex(content)
    });

    return {
      type: 'TypeScriptModule',
      name: filename,
      component_id: `TS_${plugin.toUpperCase()}_${filename.toUpperCase()}`,
      file: relPath,
      plugin,
      inputs: [],
      child_components: [],
      api_calls,
      route_refs,
      exports,
      content_fingerprint: contentFingerprint,
      line_count: content.split('\n').length
    };
  }
}

module.exports = VueAstExtractor;
