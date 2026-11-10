/**
 * OrangeHRM QKG Routes Extractor
 * Parses Symfony routes.yaml files to extract ApiEndpoints and handler classes.
 */

const fs = require('fs');

class RoutesExtractor {
  static parseRoutesFile(filePath, pluginName) {
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const routes = [];
    let currentRoute = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const routeMatch = line.match(/^([a-zA-Z0-9_]+):\s*$/);
      if (routeMatch) {
        if (currentRoute) routes.push(currentRoute);
        currentRoute = {
          route_id: routeMatch[1],
          plugin: pluginName,
          path: '',
          controller: '',
          api_handler: '',
          methods: ['GET'],
          source_file: filePath
        };
        continue;
      }

      if (currentRoute) {
        const pathMatch = line.match(/^\s*path:\s*(.+)$/);
        if (pathMatch) currentRoute.path = pathMatch[1].trim();

        const ctrlMatch = line.match(/^\s*controller:\s*(.+)$/);
        if (ctrlMatch) currentRoute.controller = ctrlMatch[1].trim();

        const methodsMatch = line.match(/^\s*methods:\s*\[(.*)\]/);
        if (methodsMatch) {
          currentRoute.methods = methodsMatch[1]
            .split(',')
            .map(m => m.trim().replace(/['"]/g, ''))
            .filter(Boolean);
        }

        const apiMatch = line.match(/^\s*_api:\s*(.+)$/);
        if (apiMatch) currentRoute.api_handler = apiMatch[1].trim();
      }
    }

    if (currentRoute) routes.push(currentRoute);

    // Expand into discrete HTTP method + path endpoints
    const endpoints = [];
    for (const r of routes) {
      const handlerClass = r.api_handler || r.controller || 'GenericRestController';
      for (const m of r.methods) {
        endpoints.push({
          endpoint_id: `${m} ${r.path}`,
          http_method: m,
          path: r.path,
          route_name: r.route_id,
          plugin: r.plugin,
          handler_class: handlerClass,
          auth_required: !r.path.includes('/login') && !r.path.includes('/public'),
          source_file: r.source_file
        });
      }
    }

    return endpoints;
  }
}

module.exports = RoutesExtractor;

