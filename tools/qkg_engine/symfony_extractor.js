/**
 * Symfony DI Container, Event Dispatcher & Menu Configurator Extractor (Phase 5)
 *
 * Scans ALL 23 plugins + src/lib for:
 *  1. *PluginConfiguration.php + Services.php -> INJECTED_WITH edges
 *     (container->register(Services::X, Class::class), constructor DI, and ServiceContainerTrait usage)
 *  2. EventSubscriberInterface / AbstractEventSubscriber -> (:Class)-[:LISTENS_TO]->(:Event)
 *     plus EventDispatcher dispatch() calls -> (:Method|Class)-[:DISPATCHES]->(:Event)
 *  3. MenuConfigurator implementations + LeftMenu services -> (:Class)-[:EXTENDS_MENU]->(:UIPage)
 */

const fs = require('fs');
const path = require('path');
const { LIB_DIR, PLUGINS_DIR, WORKSPACE_ROOT, toRepoRelPath } = require('./qkg_config');

class SymfonyExtractor {
  _parseServicesRegistry() {
    const servicesPhp = path.join(LIB_DIR, 'framework', 'Services.php');
    const constToKey = new Map();
    const constToDocFqcn = new Map();
    if (!fs.existsSync(servicesPhp)) return { constToKey, constToDocFqcn };

    const src = fs.readFileSync(servicesPhp, 'utf8');
    const blockRe = /(?:\/\*\*[\s\S]*?@see\s+\\?([A-Za-z0-9_\\]+)\s*[\s\S]*?\*\/\s*)?public\s+const\s+([A-Z0-9_]+)\s*=\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = blockRe.exec(src)) !== null) {
      const constName = m[2];
      const key = m[3];
      constToKey.set(constName, key);
      if (m[1]) constToDocFqcn.set(constName, m[1].replace(/^\\+/, ''));
    }
    return { constToKey, constToDocFqcn };
  }

  _extractUseMap(src) {
    const useMap = {};
    for (const m of src.matchAll(/use\s+([A-Za-z0-9_\\]+)(?:\s+as\s+([A-Za-z0-9_]+))?\s*;/g)) {
      const fqcn = m[1].replace(/^\\+/, '');
      const alias = m[2] || fqcn.split('\\').pop();
      useMap[alias] = fqcn;
    }
    return useMap;
  }

  _resolveShort(name, ns, useMap) {
    if (!name) return null;
    const clean = name.replace(/^\\+/, '').trim();
    if (useMap[clean]) return useMap[clean];
    if (clean.includes('\\')) return clean;
    return ns ? `${ns}\\${clean}` : clean;
  }

  _buildMenuActionMap() {
    if (this._menuActionCache) return this._menuActionCache;
    const byFqcn = new Map();
    const addUrl = (fqcn, url) => {
      if (!fqcn || !url) return;
      const cleanFqcn = fqcn.replace(/\\\\/g, '\\').replace(/^\\+/, '');
      if (!byFqcn.has(cleanFqcn)) byFqcn.set(cleanFqcn, new Set());
      byFqcn.get(cleanFqcn).add(url);
    };

    // Scan installer MenuItem.yaml and plugin SQL RBAC migrations
    const scanDirs = [PLUGINS_DIR, path.join(WORKSPACE_ROOT, 'orange_hrm', 'installer')];
    const walk = (d) => {
      if (!fs.existsSync(d)) return;
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory() && e.name !== 'vendor' && e.name !== 'node_modules') walk(f);
        else if (e.isFile() && (e.name.includes('MenuItem') && e.name.endsWith('.yaml') || e.name.endsWith('.sql'))) {
          const txt = fs.readFileSync(f, 'utf8');
          if (!txt.includes('MenuItemConfigurator') && !txt.includes('menuConfigurator') && !txt.includes('menu_configurator')) continue;
          // YAML style: actionUrl: viewPersonalDetails, ... menuConfigurator: OrangeHRM\Pim\Menu\PIMLeftMenuItemConfigurator
          for (const m of txt.matchAll(/actionUrl:\s*([A-Za-z0-9_]+)[^}\n]*menuConfigurator:\s*([A-Za-z0-9_\\]+)/g)) {
            addUrl(m[2], m[1]);
          }
          // SQL style: SELECT 'Employee Payslips', ..., 'viewEmployeePayslips', 'OrangeHRM\\Payroll\\Menu\\PayrollEmployeeMenuItemConfigurator'
          for (const m of txt.matchAll(/'([A-Za-z0-9_]+)'\s*,\s*'([A-Za-z0-9_\\]+MenuItemConfigurator)'/g)) {
            addUrl(m[2], m[1]);
          }
        }
      }
    };
    scanDirs.forEach(walk);
    this._menuActionCache = byFqcn;
    return byFqcn;
  }

  _findMenuConfiguratorActionUrls(clsFqcn, src) {
    const map = this._buildMenuActionMap();
    const urls = new Set(map.get(clsFqcn) || []);
    // Also check $availableActions keys inside LeftMenuService classes
    const availBlock = src.match(/private\s+array\s+\$availableActions\s*=\s*\[([\s\S]*?)\];/);
    if (availBlock) {
      for (const m of availBlock[1].matchAll(/^\s*'([A-Za-z0-9_]+)'\s*=>\s*\[/gm)) {
        urls.add(m[1]);
      }
    }
    return [...urls];
  }

  _extractPluginConfigurations(servicesRegistry, classByFqcn) {
    const diEdges = [];
    const listenerRegistrations = [];
    const registeredServicesByConst = new Map();

    const pluginDirs = fs.existsSync(PLUGINS_DIR) ? fs.readdirSync(PLUGINS_DIR) : [];
    for (const plugin of pluginDirs) {
      const configDir = path.join(PLUGINS_DIR, plugin, 'config');
      if (!fs.existsSync(configDir)) continue;
      for (const fname of fs.readdirSync(configDir)) {
        if (!fname.endsWith('PluginConfiguration.php')) continue;
        const absFile = path.join(configDir, fname);
        const relFile = toRepoRelPath(absFile);
        const src = fs.readFileSync(absFile, 'utf8');
        const useMap = this._extractUseMap(src);
        const nsMatch = src.match(/namespace\s+([A-Za-z0-9_\\]+)\s*;/);
        const ns = nsMatch ? nsMatch[1] : '';
        const clsMatch = src.match(/class\s+([A-Za-z0-9_]+)/);
        const configClassFqcn = clsMatch ? (ns ? `${ns}\\${clsMatch[1]}` : clsMatch[1]) : relFile;

        // 1. $this->getContainer()->register(Services::CONST, TargetClass::class)
        const regRe = /register\(\s*Services::([A-Z0-9_]+)\s*(?:,\s*([A-Za-z0-9_\\]+)::class\s*)?\)/g;
        let rm;
        while ((rm = regRe.exec(src)) !== null) {
          const svcConst = rm[1];
          const targetShort = rm[2];
          let targetFqcn = targetShort ? this._resolveShort(targetShort, ns, useMap) : servicesRegistry.constToDocFqcn.get(svcConst);
          if (!targetFqcn) targetFqcn = servicesRegistry.constToDocFqcn.get(svcConst);
          if (targetFqcn) {
            registeredServicesByConst.set(svcConst, targetFqcn);
            if (classByFqcn.has(configClassFqcn) && classByFqcn.has(targetFqcn)) {
              diEdges.push({
                from_class_fqcn: configClassFqcn,
                to_class_fqcn: targetFqcn,
                service_key: servicesRegistry.constToKey.get(svcConst) || svcConst,
                evidence_type: 'STATIC_CONFIG',
                confidence: 0.9
              });
            }
          }
        }

        // 2. addSubscriber(new SomeSubscriber(...))
        const subRe = /addSubscriber\(\s*new\s+([A-Za-z0-9_\\]+)/g;
        let sm;
        while ((sm = subRe.exec(src)) !== null) {
          const subFqcn = this._resolveShort(sm[1], ns, useMap);
          if (classByFqcn.has(configClassFqcn) && classByFqcn.has(subFqcn)) {
            diEdges.push({
              from_class_fqcn: configClassFqcn,
              to_class_fqcn: subFqcn,
              service_key: 'event_dispatcher.subscriber',
              evidence_type: 'STATIC_CONFIG',
              confidence: 0.9
            });
          }
        }

        // 3. addListener(Event::NAME, ...)
        const lisRe = /addListener\(\s*([A-Za-z0-9_\\]+::[A-Z0-9_]+|['"][^'"]+['"])\s*,\s*\[?\s*(?:new\s+)?([A-Za-z0-9_\\]+)/g;
        let lm;
        while ((lm = lisRe.exec(src)) !== null) {
          listenerRegistrations.push({
            eventName: lm[1].replace(/['"]/g, ''),
            listenerFqcn: this._resolveShort(lm[2], ns, useMap)
          });
        }
      }
    }

    return { diEdges, listenerRegistrations, registeredServicesByConst };
  }

  extractAll({ prodParsedFiles = [], uiPages = [] } = {}) {
    const classByFqcn = new Map();
    const classesList = [];
    for (const pf of prodParsedFiles) {
      for (const cls of pf.classes || []) {
        classByFqcn.set(cls.fqcn, cls);
        classesList.push(cls);
      }
    }

    const servicesRegistry = this._parseServicesRegistry();
    const {
      diEdges: configDiEdges,
      listenerRegistrations,
      registeredServicesByConst
    } = this._extractPluginConfigurations(servicesRegistry, classByFqcn);

    const diEdgeMap = new Map();
    const pushDi = (edge) => {
      if (!edge.from_class_fqcn || !edge.to_class_fqcn || edge.from_class_fqcn === edge.to_class_fqcn) return;
      if (!classByFqcn.has(edge.from_class_fqcn) || !classByFqcn.has(edge.to_class_fqcn)) return;
      const key = `${edge.from_class_fqcn}->${edge.to_class_fqcn}`;
      const prev = diEdgeMap.get(key);
      if (!prev || edge.confidence > prev.confidence) diEdgeMap.set(key, edge);
    };

    for (const e of configDiEdges) pushDi(e);

    // Constructor DI, ServiceTraits, EventSubscribers, Event Dispatch, and Menu Configurators
    const eventsMap = new Map();
    const listenEdges = [];
    const dispatchEdges = [];
    const menuEdges = [];

    const ensureEvent = (name, category = 'SYMFONY_EVENT') => {
      const clean = String(name || '').trim();
      if (!clean) return null;
      if (!eventsMap.has(clean)) {
        eventsMap.set(clean, { event_id: clean, name: clean, category });
      }
      return eventsMap.get(clean);
    };

    for (const lr of listenerRegistrations) {
      if (classByFqcn.has(lr.listenerFqcn)) {
        ensureEvent(lr.eventName, 'SYMFONY_KERNEL_EVENT');
        listenEdges.push({
          class_fqcn: lr.listenerFqcn,
          event_name: lr.eventName,
          handler_method: null,
          evidence_type: 'STATIC_CONFIG',
          confidence: 0.9
        });
      }
    }

    const fileCache = new Map();
    const readRel = (rel) => {
      if (!rel) return '';
      if (!fileCache.has(rel)) {
        const abs = path.join(WORKSPACE_ROOT, rel);
        fileCache.set(rel, fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '');
      }
      return fileCache.get(rel);
    };

    for (const cls of classesList) {
      // Constructor parameter DI edges
      for (const depFqcn of cls.constructor_deps || []) {
        pushDi({
          from_class_fqcn: cls.fqcn,
          to_class_fqcn: depFqcn,
          service_key: 'constructor_di',
          evidence_type: 'CONSTRUCTOR_DI',
          confidence: 0.95
        });
      }

      // Container lookup Services::X in class source
      const src = readRel(cls.source_file);
      if (src.includes('Services::')) {
        for (const sm of src.matchAll(/Services::([A-Z0-9_]+)/g)) {
          const svcConst = sm[1];
          const targetFqcn = registeredServicesByConst.get(svcConst) || servicesRegistry.constToDocFqcn.get(svcConst);
          if (targetFqcn) {
            pushDi({
              from_class_fqcn: cls.fqcn,
              to_class_fqcn: targetFqcn,
              service_key: servicesRegistry.constToKey.get(svcConst) || svcConst,
              evidence_type: 'STATIC_CONFIG',
              confidence: 0.9
            });
          }
        }
      }

      // Event subscribers
      const isSubscriber =
        (cls.extends_fqcn && cls.extends_fqcn.endsWith('AbstractEventSubscriber')) ||
        (cls.implements || []).some((i) => i.endsWith('EventSubscriberInterface')) ||
        cls.name.endsWith('Subscriber');

      if (isSubscriber && src.includes('getSubscribedEvents')) {
        const subBlock = src.match(/function\s+getSubscribedEvents\s*\([^)]*\)[^{]*\{([\s\S]*?)\}/);
        if (subBlock) {
          const pairRe = /([A-Za-z0-9_\\]+::[A-Z0-9_]+|['"][^'"]+['"])\s*=>\s*(?:\[\s*\[\s*['"]([A-Za-z0-9_]+)['"]|\[\s*['"]([A-Za-z0-9_]+)['"]|['"]([A-Za-z0-9_]+)['"])/g;
          let pm;
          while ((pm = pairRe.exec(subBlock[1])) !== null) {
            const rawEvent = pm[1].replace(/['"]/g, '');
            const handlerMethod = pm[2] || pm[3] || pm[4] || null;
            const resolvedEv = rawEvent.includes('::')
              ? (() => {
                  const [clsPart, constPart] = rawEvent.split('::');
                  const fq = cls.useMap?.[clsPart] || `${cls.namespace}\\${clsPart}`;
                  return `${fq}::${constPart}`;
                })()
              : rawEvent;
            ensureEvent(resolvedEv, 'SYMFONY_EVENT');
            listenEdges.push({
              class_fqcn: cls.fqcn,
              event_name: resolvedEv,
              handler_method: handlerMethod,
              evidence_type: 'SYMFONY_EVENT_SUBSCRIBER',
              confidence: 0.95
            });
          }
        }
      }

      // Event dispatches
      if (src.includes('->dispatch(')) {
        const dispRe = /->dispatch\(\s*([^,;]+?)\s*(?:,\s*([A-Za-z0-9_\\]+::[A-Z0-9_]+|['"][^'"]+['"]))?\s*\)/g;
        let dm;
        while ((dm = dispRe.exec(src)) !== null) {
          let evName = dm[2] ? dm[2].replace(/['"]/g, '') : null;
          if (!evName && dm[1]) {
            const newEv = dm[1].match(/new\s+([A-Za-z0-9_\\]+)/);
            if (newEv) evName = cls.useMap?.[newEv[1]] || newEv[1];
          }
          if (evName && evName.includes('::')) {
            const [clsPart, constPart] = evName.split('::');
            const fq = cls.useMap?.[clsPart] || `${cls.namespace}\\${clsPart}`;
            evName = `${fq}::${constPart}`;
          }
          if (evName) {
            ensureEvent(evName, 'SYMFONY_EVENT');
            dispatchEdges.push({
              class_fqcn: cls.fqcn,
              event_name: evName,
              evidence_type: 'SYMFONY_EVENT_DISPATCH',
              confidence: 0.9
            });
          }
        }
      }

      // Menu configurators & LeftMenu services -> UIPage
      const isMenuConfigurator =
        (cls.implements || []).some((i) => i.endsWith('MenuConfigurator')) ||
        cls.name.endsWith('MenuItemConfigurator') ||
        cls.name.endsWith('LeftMenuService');

      if (isMenuConfigurator) {
        const plugin = cls.source_file && cls.source_file.match(/plugins\/(orangehrm[A-Za-z0-9]+Plugin)\//)?.[1];
        const menuTitleMatches = [...src.matchAll(/getMenuItemByTitle\(\s*['"]([^'"]+)['"]/g)].map((x) => x[1]);
        const declaredUrls = this._findMenuConfiguratorActionUrls(cls.fqcn, src);
        const targetPages = uiPages.filter((p) => {
          const pname = (p.page_id || '').toLowerCase();
          const pcomp = (p.component_name || '').toLowerCase();
          if (declaredUrls.length > 0) {
            return declaredUrls.some((urlSlug) => {
              const slugNorm = urlSlug.toLowerCase().replace(/^view/, '').replace(/[^a-z0-9]/g, '');
              if (slugNorm.length < 4) return false;
              return pname.replace(/[^a-z0-9]/g, '').includes(slugNorm) || pcomp.includes(slugNorm);
            });
          }
          if (plugin && p.plugin === plugin) return true;
          return false;
        });
        for (const page of targetPages) {
          menuEdges.push({
            class_fqcn: cls.fqcn,
            page_id: page.page_id,
            menu_titles: menuTitleMatches,
            evidence_type: 'MENU_CONFIGURATOR',
            confidence: 0.9
          });
        }
      }
    }

    return {
      diEdges: [...diEdgeMap.values()],
      events: [...eventsMap.values()],
      listenEdges,
      dispatchEdges,
      menuEdges,
      diagnostics: {
        diEdges: diEdgeMap.size,
        events: eventsMap.size,
        listenEdges: listenEdges.length,
        dispatchEdges: dispatchEdges.length,
        menuEdges: menuEdges.length
      }
    };
  }
}

module.exports = SymfonyExtractor;
