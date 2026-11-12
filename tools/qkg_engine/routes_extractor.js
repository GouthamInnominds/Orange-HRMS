/**
 * OrangeHRM QKG Routes Extractor
 * Parses Symfony routes.yaml files to extract discrete ApiEndpoints and normalized handler FQCNs.
 */

const fs = require('fs');
const { toRepoRelPath } = require('./qkg_config');
const { sha256Hex } = require('./canonical_hash');

class RoutesExtractor {
  static parseRoutesFile(filePath, pluginName) {
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const routes = [];
    let currentRoute = null;
    const relSource = toRepoRelPath(filePath);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const routeMatch = line.match(/^([a-zA-Z0-9_\-.]+):\s*$/);
      if (routeMatch) {
        if (currentRoute) routes.push(currentRoute);
        currentRoute = {
          route_id: routeMatch[1],
          plugin: pluginName,
          path: '',
          controller: '',
          api_handler: '',
          methods: ['GET'],
          source_file: relSource
        };
        continue;
      }

      if (currentRoute) {
        const pathMatch = line.match(/^\s*path:\s*(.+)$/);
        if (pathMatch) currentRoute.path = pathMatch[1].trim().replace(/^['"]|['"]$/g, '');

        const ctrlMatch = line.match(/^\s*controller:\s*(.+)$/);
        if (ctrlMatch) currentRoute.controller = ctrlMatch[1].trim().replace(/^['"]|['"]$/g, '');

        const methodsMatch = line.match(/^\s*methods:\s*\[(.*)\]/);
        if (methodsMatch) {
          const parsedMethods = methodsMatch[1]
            .split(',')
            .map(m => m.trim().replace(/['"]/g, ''))
            .filter(Boolean);
          if (parsedMethods.length > 0) {
            currentRoute.methods = parsedMethods;
          }
        }

        const apiMatch = line.match(/^\s*_api:\s*(.+)$/);
        if (apiMatch) currentRoute.api_handler = apiMatch[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }

    if (currentRoute) routes.push(currentRoute);

    const endpoints = [];
    for (const r of routes) {
      if (!r.path) continue;
      const rawHandler = r.api_handler || r.controller || 'OrangeHRM\\Core\\Controller\\Rest\\V2\\GenericRestController';
      const cleanHandler = rawHandler.replace(/^\\+/, '');
      const [handlerFqcn, handlerMethod] = cleanHandler.split('::');
      const isRestApi = Boolean(r.api_handler) || r.path.startsWith('/api/');

      for (const m of r.methods) {
        const endpointObj = {
          endpoint_id: `${m} ${r.path}`,
          http_method: m,
          path: r.path,
          route_name: r.route_id,
          plugin: r.plugin,
          handler_class: cleanHandler,
          handler_fqcn: handlerFqcn,
          handler_method: handlerMethod || (r.api_handler ? null : 'handle'),
          endpoint_kind: isRestApi ? 'REST_API' : 'WEB_SCREEN',
          auth_required: !r.path.includes('/login') && !r.path.includes('/public'),
          source_file: r.source_file
        };
        endpointObj.content_fingerprint = sha256Hex(endpointObj);
        endpoints.push(endpointObj);
      }
    }

    return endpoints;
  }
}

module.exports = RoutesExtractor;
