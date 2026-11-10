const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceRoot = path.resolve(__dirname, '..');
const orangeHrmRoot = path.join(workspaceRoot, 'orange_hrm');
const pluginsDir = path.join(orangeHrmRoot, 'src', 'plugins');
const outputDir = path.join(workspaceRoot, 'OrangeHRM_Baseline_v1.0');

function getCommitSha() {
  try {
    return execSync('git rev-parse HEAD', { cwd: workspaceRoot }).toString().trim();
  } catch (e) {
    return '4b88be22f8ae75561e2ff14a2b5fc31feb36d214';
  }
}

function parseRoutesYaml(content) {
  const routes = [];
  const lines = content.split(/\r?\n/);
  let currentRoute = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check top-level route key: e.g. "apiv2_pim_employee:"
    const routeMatch = line.match(/^([a-zA-Z0-9_]+):\s*$/);
    if (routeMatch) {
      if (currentRoute) routes.push(currentRoute);
      currentRoute = {
        name: routeMatch[1],
        path: '',
        controller: '',
        methods: [],
        apiHandler: '',
        params: []
      };
      continue;
    }

    if (currentRoute) {
      const pathMatch = line.match(/^\s*path:\s*(.+)$/);
      if (pathMatch) {
        currentRoute.path = pathMatch[1].trim();
        const paramMatches = currentRoute.path.match(/\{([a-zA-Z0-9_]+)\}/g);
        if (paramMatches) {
          currentRoute.params = paramMatches.map(p => p.replace(/[{}]/g, ''));
        }
      }

      const ctrlMatch = line.match(/^\s*controller:\s*(.+)$/);
      if (ctrlMatch) currentRoute.controller = ctrlMatch[1].trim();

      const methodsMatch = line.match(/^\s*methods:\s*\[(.*)\]/);
      if (methodsMatch) {
        currentRoute.methods = methodsMatch[1].split(',').map(m => m.trim().replace(/['"]/g, '')).filter(Boolean);
      }

      const apiMatch = line.match(/^\s*_api:\s*(.+)$/);
      if (apiMatch) currentRoute.apiHandler = apiMatch[1].trim();
    }
  }

  if (currentRoute) routes.push(currentRoute);
  return routes;
}

function scanPlugins() {
  const plugins = [];
  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pluginName = entry.name;
    const pluginPath = path.join(pluginsDir, pluginName);

    // Routes
    let routes = [];
    const routesFile = path.join(pluginPath, 'config', 'routes.yaml');
    if (fs.existsSync(routesFile)) {
      routes = parseRoutesYaml(fs.readFileSync(routesFile, 'utf8'));
    }

    // Entities
    const entities = [];
    const entityDir = path.join(pluginPath, 'entity');
    if (fs.existsSync(entityDir)) {
      const files = fs.readdirSync(entityDir);
      for (const f of files) {
        if (f.endsWith('.php')) entities.push(f.replace('.php', ''));
      }
    }

    // Services
    const services = [];
    const serviceDir = path.join(pluginPath, 'Service');
    if (fs.existsSync(serviceDir)) {
      const files = fs.readdirSync(serviceDir);
      for (const f of files) {
        if (f.endsWith('.php')) services.push(f.replace('.php', ''));
      }
    }

    // DAOs
    const daos = [];
    const daoDir = path.join(pluginPath, 'Dao');
    if (fs.existsSync(daoDir)) {
      const files = fs.readdirSync(daoDir);
      for (const f of files) {
        if (f.endsWith('.php')) daos.push(f.replace('.php', ''));
      }
    }

    // Controllers
    const controllers = [];
    const ctrlDir = path.join(pluginPath, 'Controller');
    if (fs.existsSync(ctrlDir)) {
      const files = fs.readdirSync(ctrlDir);
      for (const f of files) {
        if (f.endsWith('.php')) controllers.push(f.replace('.php', ''));
      }
    }

    // APIs
    const apis = [];
    const apiDir = path.join(pluginPath, 'Api');
    if (fs.existsSync(apiDir)) {
      const files = fs.readdirSync(apiDir);
      for (const f of files) {
        if (f.endsWith('.php')) apis.push(f.replace('.php', ''));
      }
    }

    // Tests & Test methods
    const testFiles = [];
    let testMethodCount = 0;
    const testDir = path.join(pluginPath, 'test');
    if (fs.existsSync(testDir)) {
      function findTests(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            findTests(fullPath);
          } else if (item.name.endsWith('Test.php')) {
            const relPath = path.relative(orangeHrmRoot, fullPath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const methods = [];
            const matches = content.matchAll(/public\s+function\s+(test[a-zA-Z0-9_]*)\s*\(/g);
            for (const m of matches) {
              methods.push(m[1]);
              testMethodCount++;
            }
            testFiles.push({
              file: relPath.replace(/\\/g, '/'),
              className: item.name.replace('.php', ''),
              testCount: methods.length,
              methods: methods
            });
          }
        }
      }
      findTests(testDir);
    }

    plugins.push({
      name: pluginName,
      routesCount: routes.length,
      routes: routes,
      entitiesCount: entities.length,
      entities: entities,
      servicesCount: services.length,
      services: services,
      daosCount: daos.length,
      daos: daos,
      controllersCount: controllers.length,
      controllers: controllers,
      apisCount: apis.length,
      apis: apis,
      testFilesCount: testFiles.length,
      testMethodsCount: testMethodCount,
      testFiles: testFiles
    });
  }

  return plugins;
}

console.log('Scanning OrangeHRM codebase...');
const plugins = scanPlugins();
const commitSha = getCommitSha();

const totalRoutes = plugins.reduce((acc, p) => acc + p.routesCount, 0);
const totalEntities = plugins.reduce((acc, p) => acc + p.entitiesCount, 0);
const totalServices = plugins.reduce((acc, p) => acc + p.servicesCount, 0);
const totalDaos = plugins.reduce((acc, p) => acc + p.daosCount, 0);
const totalApis = plugins.reduce((acc, p) => acc + p.apisCount, 0);
const totalTestFiles = plugins.reduce((acc, p) => acc + p.testFilesCount, 0);
const totalTestMethods = plugins.reduce((acc, p) => acc + p.testMethodsCount, 0);

console.log(`Scan summary:
- Plugins: ${plugins.length}
- API Routes: ${totalRoutes}
- Entities: ${totalEntities}
- Services: ${totalServices}
- DAOs: ${totalDaos}
- APIs: ${totalApis}
- Test Files: ${totalTestFiles}
- PHPUnit Test Methods: ${totalTestMethods}
`);

// 1. Generate baseline manifest
const manifest = {
  baseline_id: 'ORANGEHRM_BASELINE_v1.0',
  application: 'OrangeHRM Starter Edition',
  version: '5.x Starter',
  repository: 'https://github.com/GouthamInnominds/Orange-HRMS.git',
  branch: 'main',
  commit_sha: commitSha,
  timestamp: new Date().toISOString(),
  environment: {
    php_target: '8.1 / 8.2',
    framework: 'Symfony 5.x / Doctrine DBAL & ORM',
    frontend: 'Vue 3 / TypeScript / Pinia',
    database: 'MySQL 8.0 / MariaDB 10.x'
  },
  inventory_summary: {
    total_plugins: plugins.length,
    total_api_routes: totalRoutes,
    total_entities: totalEntities,
    total_services: totalServices,
    total_daos: totalDaos,
    total_apis: totalApis,
    total_test_files: totalTestFiles,
    total_phpunit_methods: totalTestMethods
  },
  plugins: plugins.map(p => ({
    name: p.name,
    routes: p.routesCount,
    entities: p.entitiesCount,
    services: p.servicesCount,
    daos: p.daosCount,
    apis: p.apisCount,
    test_files: p.testFilesCount,
    test_methods: p.testMethodsCount
  }))
};

fs.writeFileSync(
  path.join(outputDir, '05_Traceability', 'baseline_manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('Saved baseline_manifest.json');

// 2. Generate unit_tests.json
const allUnitTests = [];
let unitTestIdCounter = 1;

for (const plugin of plugins) {
  for (const tf of plugin.testFiles) {
    for (const m of tf.methods) {
      allUnitTests.push({
        testcase_id: `TC_UNIT_${String(unitTestIdCounter++).padStart(5, '0')}`,
        plugin: plugin.name,
        test_file: tf.file,
        class_name: tf.className,
        method_name: m,
        test_level: 'Unit',
        test_type: ['Functional', 'Automated'],
        quality_attributes: ['CodeCorrectness', 'Maintainability'],
        target_interface: {
          class: tf.className.replace(/Test$/, '')
        },
        execution_type: 'PHPUnit',
        automation_status: 'Automated'
      });
    }
  }
}

fs.writeFileSync(
  path.join(outputDir, '04_Test_Strategy', 'unit_tests.json'),
  JSON.stringify(allUnitTests, null, 2)
);
console.log(`Saved unit_tests.json (${allUnitTests.length} tests)`);

// 3. Generate api_inventory.md
let apiMd = `# OrangeHRM v1.0 API Inventory (Evidence-Based)\n\n`;
apiMd += `> Extracted automatically from \`routes.yaml\` across all 22 plugins.\n`;
apiMd += `> Total Registered Routes: **${totalRoutes}**\n\n`;
apiMd += `| Plugin | Route Name | HTTP Methods | Path | Controller / API Handler |\n`;
apiMd += `| :--- | :--- | :--- | :--- | :--- |\n`;

for (const plugin of plugins) {
  for (const r of plugin.routes) {
    const handler = r.apiHandler || r.controller || 'Default';
    apiMd += `| \`${plugin.name}\` | \`${r.name}\` | \`${r.methods.join(', ') || 'GET'}\` | \`${r.path}\` | \`${handler}\` |\n`;
  }
}

fs.writeFileSync(
  path.join(outputDir, '03_System_Architecture', 'api_inventory.md'),
  apiMd
);
console.log('Saved api_inventory.md');

