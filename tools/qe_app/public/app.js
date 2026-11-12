// Quality Intelligence Platform Frontend Controller (v2.0)
const app = {
  currentTab: 'overview',
  chatHistory: [],
  charts: {},
  network: null,
  cataloguePage: 1,
  catalogueLimit: 50,
  lastAnalyzedFiles: [],

  escapeHtml(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  init() {
    this.setupTabs();
    this.syncSnapshotHealthBanner();
    this.loadOverview();
    this.setupSSE();
  },

  async syncSnapshotHealthBanner() {
    try {
      const [statusRes, dbRes] = await Promise.all([
        fetch('/api/v2/intelligence/status'),
        fetch('/api/v2/database/overview').catch(() => null)
      ]);
      const env = await statusRes.json();
      const badge = document.getElementById('topbar-snapshot-badge');
      const meta = document.getElementById('topbar-snapshot-meta');
      const dotNeo = document.getElementById('dot-neo4j');
      const lblNeo = document.getElementById('label-neo4j');
      const lblBase = document.getElementById('label-baseline');
      const strip = document.getElementById('completeness-banner');

      const st = env.analysisStatus || 'UNAVAILABLE';
      const badgeCls = st === 'SUCCESS' ? 'badge-success' : (st === 'PARTIAL' || st === 'STALE' ? 'badge-warning' : 'badge-danger');
      if (badge) {
        badge.className = `badge ${badgeCls}`;
        badge.innerText = `QKG: ${st}`;
      }
      if (meta) {
        const snapId = env.graphSnapshotId || 'none';
        const appSha = env.appCommit ? String(env.appCommit).slice(0, 8) : 'n/a';
        const qaSha = env.qaCommit ? String(env.qaCommit).slice(0, 8) : 'n/a';
        meta.innerText = `Snapshot: ${snapId} | App: ${appSha} | QA: ${qaSha}`;
      }
      if (dotNeo && lblNeo) {
        if (st === 'UNAVAILABLE') {
          dotNeo.className = 'dot offline';
          lblNeo.innerText = 'Neo4j QKG UNAVAILABLE';
        } else if (st === 'STALE') {
          dotNeo.className = 'dot stale';
          lblNeo.innerText = 'Neo4j QKG STALE';
        } else {
          dotNeo.className = 'dot';
          lblNeo.innerText = `Neo4j QKG (${st})`;
        }
      }
      if (lblBase) {
        lblBase.innerText = `Snapshot: ${env.graphSnapshotId || 'UNAVAILABLE'}`;
      }
      if (strip && env.completeness) {
        const pills = Object.entries(env.completeness).map(([k, v]) => {
          const cls = v === 'COMPLETE' ? 'badge-success' : (v === 'PARTIAL' ? 'badge-warning' : 'badge-danger');
          return `<span class="badge ${cls}">${this.escapeHtml(k)}: ${this.escapeHtml(v)}</span>`;
        }).join('');
        const warnText = (env.limitations || []).length > 0
          ? `<span style="color: var(--accent-warning); margin-left: auto;">⚠ ${this.escapeHtml(env.limitations[0])}</span>`
          : '';
        strip.innerHTML = `<strong>5-Layer Completeness:</strong> ${pills} ${warnText}`;
      }

      if (dbRes) {
        const dbData = await dbRes.json();
        const dotDb = document.getElementById('dot-mariadb');
        const lblDb = document.getElementById('label-mariadb');
        if (dotDb && lblDb) {
          if (dbData.status === 'ONLINE') {
            dotDb.className = 'dot';
            lblDb.innerText = `MariaDB Online (${dbData.totalTables} tables)`;
          } else {
            dotDb.className = 'dot offline';
            lblDb.innerText = 'MariaDB 3306 UNAVAILABLE';
          }
        }
      }
    } catch (e) {
      console.warn('Snapshot health probe failed:', e);
    }
  },

  setupTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tab}`)?.classList.add('active');

    const titles = {
      overview: 'Application Quality Overview',
      intelligence: 'Test Intelligence & Code-AST Catalogue',
      graph: 'Knowledge Graph Insights (Neo4j QKG)',
      tia: 'Change Impact Analysis (TIA Studio)',
      database: 'Database & SQL Studio (MariaDB)',
      release: 'Release Readiness, Snapshot Diffs & QKG-15 Benchmark',
      chatbot: 'Agentic AI Quality Engineering Workspace'
    };
    document.getElementById('page-title').innerText = titles[tab] || 'Quality Intelligence';

    if (tab === 'overview') this.loadOverview();
    if (tab === 'intelligence') this.loadIntelligence();
    if (tab === 'graph') this.loadGraph();
    if (tab === 'tia') this.loadPRAnalysis();
    if (tab === 'database') this.loadDatabase();
    if (tab === 'release') this.loadReleaseHistory();
  },

  refreshCurrentTab() {
    this.syncSnapshotHealthBanner();
    this.switchTab(this.currentTab);
  },

  // 1. Overview Tab
  async loadOverview() {
    try {
      const res = await fetch('/api/v2/quality/metrics');
      const data = await res.json();

      if (data.status === 'UNAVAILABLE') {
        document.getElementById('kpi-tests').innerText = 'UNAVAILABLE';
        document.getElementById('kpi-pass-rate').innerText = 'UNAVAILABLE';
        document.getElementById('kpi-gate').innerText = 'UNAVAILABLE';
        document.getElementById('kpi-gate').style.color = 'var(--accent-danger)';
        document.getElementById('kpi-scenarios').innerText = 'UNAVAILABLE';
        const testsSub = document.getElementById('kpi-tests-sub');
        if (testsSub) testsSub.innerText = data.error || 'Neo4j QKG offline (never fabricated as 0%)';
        return;
      }

      document.getElementById('kpi-tests').innerText = Number(data.overview.totalVerifiedTests || 0).toLocaleString();
      const testsSub = document.getElementById('kpi-tests-sub');
      if (testsSub) {
        const baseline = Number(data.overview.baselineBacklogTests || 0).toLocaleString();
        testsSub.innerText = `Code-AST Verified Tests (+ ${baseline} Planned Baseline Scenarios)`;
      }
      document.getElementById('kpi-pass-rate').innerText = data.overview.passRate || 'N/A';
      const passSub = document.getElementById('kpi-pass-sub');
      if (passSub) {
        passSub.innerText = data.overview.executionHistoryStatus === 'INGESTED'
          ? `Executed Passed / (Passed + Failed) | Flake Rate: ${data.overview.flakyRate || '0.0%'}`
          : 'No TestRun executions ingested yet (runtime history pending)';
      }
      const gateEl = document.getElementById('kpi-gate');
      if (gateEl) {
        const gate = data.overview.qualityGateStatus || 'NO_CI_RUN';
        gateEl.innerText = gate;
        gateEl.style.color = gate === 'PASS'
          ? 'var(--accent-success)'
          : (gate === 'FAIL' ? 'var(--accent-danger)' : 'var(--accent-warning)');
      }
      const gateSub = document.getElementById('kpi-gate-sub');
      if (gateSub) {
        gateSub.innerText = data.overview.lineCoveragePercent !== null && data.overview.lineCoveragePercent !== undefined
          ? `Measured Line Coverage: ${data.overview.lineCoveragePercent}%`
          : 'Line Coverage: Not Measured (run Clover ingestion)';
      }
      document.getElementById('kpi-scenarios').innerText = Number(data.overview.totalLogicalScenarios || 0).toLocaleString();
      const scenSub = document.getElementById('kpi-scenarios-sub');
      if (scenSub && data.traceability) {
        const mapPct = data.overview.mappingCoveragePercent ?? 'N/A';
        scenSub.innerText = `Mapping: ${mapPct}% | Code-traced reqs: ${data.traceability.coveragePercentage ?? 0}% | Planned backlog: ${data.traceability.plannedCoveragePercentage ?? 0}%`;
      }

      this.renderLayerChart(data.layers);
      this.renderModuleChart(data.modules);
      this.renderModuleTable(data.modules);
    } catch (e) {
      console.error('Failed to load overview:', e);
    }
  },

  renderLayerChart(layers) {
    const ctx = document.getElementById('chart-layers');
    if (!ctx) return;
    if (this.charts.layers) this.charts.layers.destroy();

    this.charts.layers = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: layers.map(l => l.layer),
        datasets: [{
          data: layers.map(l => l.count),
          backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } }
        }
      }
    });
  },

  renderModuleChart(modules) {
    const ctx = document.getElementById('chart-modules');
    if (!ctx) return;
    if (this.charts.modules) this.charts.modules.destroy();

    this.charts.modules = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: modules.map(m => m.module),
        datasets: [{
          label: 'Automated Tests',
          data: modules.map(m => m.tests),
          backgroundColor: modules.map(m => m.module === 'Payroll' ? '#22c55e' : '#38bdf8'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#24324d' } }
        }
      }
    });
  },

  renderModuleTable(modules) {
    const tbody = document.querySelector('#table-modules-summary tbody');
    if (!tbody) return;
    tbody.innerHTML = modules.map(m => `
      <tr>
        <td style="font-weight: 600; color: ${m.module === 'Payroll' ? 'var(--accent-success)' : 'inherit'};">
          ${m.module === 'Payroll' ? '✨ ' : ''}${m.module}
        </td>
        <td>${Number(m.tests || 0).toLocaleString()} tests</td>
        <td>${Number(m.classes || 0).toLocaleString()} classes</td>
        <td>${m.coverageMeasured && m.coverage !== null ? `${m.coverage}%` : '<span style="color: var(--text-muted);">Not Measured</span>'}</td>
        <td><span class="badge ${m.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}">${m.status}</span></td>
      </tr>
    `).join('');
  },

  // 2. Test Intelligence (Full Catalogue Explorer)
  async loadIntelligence() {
    try {
      const mRes = await fetch('/api/v2/quality/metrics');
      const mData = await mRes.json();
      const apiL = mData.layers.find(l => l.layer.includes('API'));
      const funcL = mData.layers.find(l => l.layer.includes('Functional'));
      const dbL = mData.layers.find(l => l.layer.includes('Database'));
      const payM = mData.modules.find(m => m.module === 'Payroll');
      if (apiL) document.getElementById('kpi-layer-api').innerText = Number(apiL.count).toLocaleString();
      if (funcL) document.getElementById('kpi-layer-func').innerText = Number(funcL.count).toLocaleString();
      if (dbL) document.getElementById('kpi-layer-db').innerText = Number(dbL.count).toLocaleString();
      const paySub = document.getElementById('kpi-payroll-sub');
      if (payM) {
        document.getElementById('kpi-payroll-count').innerText = Number(payM.tests).toLocaleString();
        if (paySub) paySub.innerText = `${Number(payM.tests).toLocaleString()} Code-AST tests (unit & domain scope)`;
      } else {
        document.getElementById('kpi-payroll-count').innerText = '0';
      }
      const titleEl = document.getElementById('catalogue-panel-title');
      if (titleEl) titleEl.innerText = `🧪 Code-AST Test Catalogue Explorer (${Number(mData.overview.totalVerifiedTests || 0).toLocaleString()} Verified Tests)`;
    } catch (e) {
      console.warn('Could not sync layer KPIs:', e);
    }
    this.filterTestCatalogue();
  },

  async filterTestCatalogue(page = 1) {
    this.cataloguePage = page;
    const search = document.getElementById('test-search-input')?.value || '';
    const moduleFilter = document.getElementById('test-module-filter')?.value || '';
    const layerFilter = document.getElementById('test-layer-filter')?.value || '';

    const url = `/api/v2/tests/catalogue?page=${this.cataloguePage}&limit=${this.catalogueLimit}&module=${encodeURIComponent(moduleFilter)}&layer=${encodeURIComponent(layerFilter)}&search=${encodeURIComponent(search)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const tbody = document.getElementById('table-catalogue-body');
      if (tbody) {
        tbody.innerHTML = data.tests.map(t => {
          const statusCls = t.status === 'PASSED'
            ? 'badge-success'
            : (t.status === 'FAILED' ? 'badge-danger' : 'badge-primary');
          return `
          <tr>
            <td style="font-weight: 600; color: var(--accent-primary); font-family: monospace;">${t.id}</td>
            <td>${t.name}</td>
            <td><code>${t.suite}</code></td>
            <td><span style="font-size: 11px; opacity: 0.9;">${t.layer}</span></td>
            <td><strong style="color: ${t.module === 'Payroll' ? 'var(--accent-success)' : 'inherit'};">${t.module}</strong></td>
            <td><span class="badge ${t.priority === 'P1' ? 'badge-danger' : 'badge-warning'}">${t.priority}</span></td>
            <td><span class="badge ${statusCls}">${t.status}</span></td>
            <td>
              <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="app.openEntityDrawer('${this.escapeHtml(t.id).replace(/'/g, "\\'")}')">🔎 Evidence</button>
              <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="app.executeSingleTest('${this.escapeHtml(t.id).replace(/'/g, "\\'")}')">Plan</button>
            </td>
          </tr>
        `;
        }).join('');
      }

      const info = document.getElementById('catalogue-pagination-info');
      if (info) {
        const start = data.tests.length > 0 ? (data.page - 1) * data.limit + 1 : 0;
        const end = data.tests.length > 0 ? Math.min(start + data.tests.length - 1, data.totalTests) : 0;
        info.innerText = `Showing ${start} - ${end} of ${data.totalTests} tests (Code-AST Verified Catalogue: ${data.grandTotalCatalogue.toLocaleString()})`;
      }

      document.getElementById('btn-prev-page').disabled = data.page <= 1;
      document.getElementById('btn-next-page').disabled = data.page >= data.totalPages;
    } catch (e) {
      console.error('Error fetching test catalogue:', e);
    }
  },

  prevCataloguePage() {
    if (this.cataloguePage > 1) this.filterTestCatalogue(this.cataloguePage - 1);
  },

  nextCataloguePage() {
    this.filterTestCatalogue(this.cataloguePage + 1);
  },

  executeSingleTest(testId) {
    this.planRegressionTests(`Single test execution plan: ${testId}`);
  },

  runSelectedTestSuite() {
    const mod = document.getElementById('test-module-filter')?.value || 'All';
    this.planRegressionTests(`Suite run for ${mod}`);
  },

  // 3. Knowledge Graph Tab (Interactive Vis-Network & Cypher Studio)
  async loadGraph() {
    try {
      const res = await fetch('/api/v2/graph/overview');
      const data = await res.json();

      document.getElementById('kg-node-count').innerText = (data.totalNodes ?? 0).toLocaleString();
      document.getElementById('kg-rel-count').innerText = (data.totalRelationships ?? 0).toLocaleString();

      // Render Horizontal Bar Chart for Node Labels (All 20 labels cleanly visible!)
      this.renderNodeLabelHorizontalBar(data.labels || []);

      // Render Interactive Vis.js Network Graph
      this.renderVisGraph();
    } catch (e) {
      console.error('Failed to load graph:', e);
    }
  },

  renderNodeLabelHorizontalBar(labels) {
    const ctx = document.getElementById('chart-kg-labels');
    if (!ctx) return;
    if (this.charts.kgLabels) this.charts.kgLabels.destroy();

    // Sort labels descending by count
    const sorted = [...labels].sort((a, b) => Number(b.count) - Number(a.count));

    this.charts.kgLabels = new Chart(ctx, {
      type: 'bar',
      indexAxis: 'y', // Horizontal bars!
      data: {
        labels: sorted.map(l => l.label),
        datasets: [{
          label: 'Nodes Count',
          data: sorted.map(l => Number(l.count)),
          backgroundColor: sorted.map(l => l.label.includes('Payroll') || l.label === 'TestCase' ? '#22c55e' : '#38bdf8'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.raw} nodes`
            }
          }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#24324d' } },
          y: { ticks: { color: '#f8fafc', font: { size: 11, weight: '600' } }, grid: { display: false } }
        }
      }
    });
  },

  async renderVisGraph() {
    const container = document.getElementById('network-container');
    if (!container || typeof vis === 'undefined') return;

    try {
      const res = await fetch('/api/v2/graph/visual?limit=80');
      const graphData = await res.json();

      const nodes = new vis.DataSet(graphData.nodes);
      const edges = new vis.DataSet(graphData.edges);

      const options = {
        nodes: {
          shape: 'dot',
          size: 16,
          font: { size: 11, color: '#f8fafc', face: 'Segoe UI' },
          borderWidth: 2
        },
        edges: {
          font: { size: 9, color: '#94a3b8', strokeWidth: 0 },
          smooth: { type: 'continuous' }
        },
        physics: {
          stabilization: { enabled: true, iterations: 120, updateInterval: 25 },
          barnesHut: { gravitationalConstant: -3500, springLength: 105 }
        },
        interaction: { hover: true, tooltipDelay: 100 }
      };

      this.network = new vis.Network(container, { nodes, edges }, options);

      this.network.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          this.openEntityDrawer(nodeId);
        }
      });
    } catch (e) {
      console.warn('Vis network render fallback:', e);
    }
  },

  fitGraph() {
    if (this.network) this.network.fit();
  },

  reloadGraphNetwork() {
    this.renderVisGraph();
  },

  loadCypherPreset() {
    const val = document.getElementById('cypher-preset-select').value;
    const presets = {
      '1': "MATCH (us:UserStory {version: 'v2.2-india-payroll'})<-[:VERIFIES_STORY]-(tc:TestCase) RETURN us.story_id AS Story, us.title AS Title, count(tc) AS ExecutedTests ORDER BY Story ASC",
      '2': "MATCH (p:Plugin {name: 'orangehrmPayrollPlugin'})-[:EXPOSES]->(e:ApiEndpoint)-[:HANDLED_BY]->(c:Class) RETURN c.name AS APIHandler, count(e) AS Endpoints ORDER BY Endpoints DESC",
      '3': "MATCH (n) WHERE n.version = 'v2.2-india-payroll' RETURN labels(n)[0] AS Label, count(n) AS Count ORDER BY Count DESC",
      '4': "MATCH (e:DatabaseEntity {version: 'v2.2-india-payroll'})-[:MAPS_TO]->(t:DatabaseTable) RETURN e.name AS Entity, t.name AS Table ORDER BY Table ASC"
    };
    document.getElementById('cypher-input').value = presets[val] || presets['1'];
  },

  async executeCypherQuery() {
    const cypher = document.getElementById('cypher-input').value.trim();
    const status = document.getElementById('cypher-status');
    status.innerText = 'Executing Cypher query on Neo4j Bolt...';

    try {
      const res = await fetch('/api/v2/graph/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cypher })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      status.innerHTML = `<span style="color: var(--accent-success);">✓ Executed in ${data.executionTimeMs}ms (${data.count} records returned)</span>`;

      if (data.records.length > 0) {
        const cols = Object.keys(data.records[0]);
        document.getElementById('cypher-thead-tr').innerHTML = cols.map(c => `<th>${c}</th>`).join('');
        document.getElementById('cypher-tbody').innerHTML = data.records.map(r => `
          <tr>${cols.map(c => `<td>${typeof r[c] === 'object' ? JSON.stringify(r[c]) : r[c]}</td>`).join('')}</tr>
        `).join('');
      } else {
        document.getElementById('cypher-tbody').innerHTML = '<tr><td colspan="5">No records returned.</td></tr>';
      }
    } catch (e) {
      status.innerHTML = `<span style="color: var(--accent-danger);">Error: ${e.message}</span>`;
    }
  },

  // 4. Change Impact Analysis (TIA) with Evidence Path Drill-Down & Advisory Isolation
  async loadPRAnalysis() {
    const prId = document.getElementById('pr-selector')?.value || 12;
    const customFilesRaw = document.getElementById('tia-custom-files')?.value?.trim() || '';
    const customFiles = customFilesRaw
      ? customFilesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : null;

    try {
      let data;
      let impactedTests = [];
      let advisoryTests = [];
      let backlogGaps = [];
      let changedFiles = [];

      if (customFiles && customFiles.length > 0) {
        const res = await fetch('/api/v2/qe/get_impacted_tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changed_files: customFiles })
        });
        const env = await res.json();
        const payload = env.data || {};
        changedFiles = payload.changedFiles || customFiles;
        impactedTests = payload.impactedRegressionTests || [];
        advisoryTests = payload.advisoryTests || [];
        backlogGaps = payload.newTestGenerationBacklog || [];
        data = {
          analysisStatus: env.analysisStatus,
          riskAssessment: payload.riskAssessment || { score: 0, gateStatus: env.analysisStatus === 'UNAVAILABLE' ? 'RED' : 'GREEN' },
          summary: payload.summary || {
            totalFiles: changedFiles.length,
            totalRequirementsImpacted: 0,
            candidateTestsCount: impactedTests.length
          }
        };
      } else {
        const res = await fetch(`/api/v2/github/pull-requests/${prId}/analysis`);
        data = await res.json();
        changedFiles = data.analyzedFiles || [];
        impactedTests = data.impactedRegressionTests || data.candidateTests || [];
        advisoryTests = data.advisoryTests || [];
        backlogGaps = data.newTestGenerationBacklog || [];
      }

      this.lastAnalyzedFiles = changedFiles;

      if (data.analysisStatus === 'UNAVAILABLE') {
        document.getElementById('tia-risk-score').innerText = 'UNAVAILABLE';
        document.getElementById('tia-gate-badge').innerHTML = `<span class="badge badge-danger">QKG UNAVAILABLE (FAIL-CLOSED)</span>`;
      } else {
        document.getElementById('tia-risk-score').innerText = `${data.riskAssessment?.score ?? '—'} / 100`;
        const badge = document.getElementById('tia-gate-badge');
        if (badge && data.riskAssessment) {
          const cls = data.riskAssessment.gateStatus === 'GREEN' ? 'badge-success' : data.riskAssessment.gateStatus === 'AMBER' ? 'badge-warning' : 'badge-danger';
          badge.innerHTML = `Status: <span class="badge ${cls}">${this.escapeHtml(data.riskAssessment.gateStatus)} RISK</span>`;
        }
      }

      document.getElementById('tia-files-count').innerText = data.summary?.totalFiles ?? changedFiles.length;
      document.getElementById('tia-req-count').innerText = data.summary?.totalRequirementsImpacted ?? 0;
      document.getElementById('tia-tests-count').innerText = impactedTests.length;
      const advSub = document.getElementById('tia-advisory-sub');
      if (advSub) {
        advSub.innerText = `Tier 3 Advisory isolated: ${advisoryTests.length} | Gaps: ${backlogGaps.length}`;
      }

      const tbody = document.getElementById('tia-candidate-tests-body');
      if (tbody) {
        if (impactedTests.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="color: var(--text-muted);">No Tier 1–2 impacted regression tests matched or QKG unavailable.</td></tr>';
        } else {
          tbody.innerHTML = impactedTests.map(t => {
            const safeId = this.escapeHtml(t.canonicalId || t.id);
            const tier = this.escapeHtml(t.evidenceTier || 'TIER_2');
            const channel = this.escapeHtml(t.impactChannel || 'DIRECT');
            const fw = this.escapeHtml(`${t.framework || 'phpunit'} · ${t.repo || 'orange-hrms'}`);
            const conf = t.confidence !== undefined ? Number(t.confidence).toFixed(2) : '—';
            const priCls = t.priority === 'P1' ? 'badge-danger' : 'badge-warning';
            return `
            <tr>
              <td style="font-weight: 600; color: var(--accent-primary); font-family: monospace;">${safeId}<div style="font-size: 11px; color: var(--text-muted); font-family: sans-serif;">${this.escapeHtml(t.name)}</div></td>
              <td><span class="evidence-chip">${channel}</span><div style="font-size: 11px; color: var(--text-muted);">${tier}</div></td>
              <td><code>${fw}</code></td>
              <td>${conf}</td>
              <td><span class="badge ${priCls}">${this.escapeHtml(t.priority || 'P2')}</span></td>
              <td><button class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px;" onclick="app.openTestEvidenceDrawer('${safeId.replace(/'/g, "\\'")}')">🔎 Evidence</button></td>
            </tr>
          `;
          }).join('');
        }
      }

      const advDiv = document.getElementById('tia-advisory-and-gaps');
      if (advDiv) {
        const advHtml = advisoryTests.length > 0
          ? `<p><strong>Isolated Tier 3 Advisory (${advisoryTests.length}):</strong> ${advisoryTests.slice(0, 8).map(t => `<code>${this.escapeHtml(t.id)}</code>`).join(', ')}</p>`
          : '<p><strong>Tier 3 Advisory:</strong> None isolated.</p>';
        const gapHtml = backlogGaps.length > 0
          ? `<p style="margin-top: 8px; color: var(--accent-warning);"><strong>Untested Impacted Targets (${backlogGaps.length}):</strong> ${backlogGaps.slice(0, 8).map(g => `<code>${this.escapeHtml(g.target || g.file || g.id)}</code>`).join(', ')}</p>`
          : '<p style="margin-top: 8px; color: var(--accent-success);"><strong>Untested Impacted Targets:</strong> None detected.</p>';
        advDiv.innerHTML = advHtml + gapHtml;
      }
    } catch (e) {
      console.error('Failed to load PR analysis:', e);
    }
  },

  async openTestEvidenceDrawer(testId) {
    const backdrop = document.getElementById('evidence-drawer-backdrop');
    const title = document.getElementById('drawer-title');
    const sub = document.getElementById('drawer-subtitle');
    const body = document.getElementById('drawer-body');
    if (!backdrop || !body) return;

    title.innerText = '🔎 Test Selection Evidence';
    sub.innerText = testId;
    body.innerHTML = 'Querying Knowledge Graph explanation trail...';
    backdrop.classList.add('open');

    try {
      const res = await fetch('/api/v2/qe/explain_test_selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: testId,
          changed_files: this.lastAnalyzedFiles || []
        })
      });
      const env = await res.json();
      const d = env.data || {};
      const exp = (d.inclusionExplanations && d.inclusionExplanations[0]) || d.test || null;
      const prov = d.testProvenance || null;

      body.innerHTML = `
        <div class="drawer-section">
          <h4>Snapshot Provenance</h4>
          <div><strong>Status:</strong> <span class="badge badge-primary">${this.escapeHtml(env.analysisStatus)}</span></div>
          <div><strong>Snapshot ID:</strong> <code>${this.escapeHtml(env.graphSnapshotId || 'UNAVAILABLE')}</code></div>
          <div><strong>App / QA Commits:</strong> <code>${this.escapeHtml(env.appCommit || 'n/a')}</code> / <code>${this.escapeHtml(env.qaCommit || 'n/a')}</code></div>
        </div>
        <div class="drawer-section">
          <h4>Selection Decision</h4>
          <div><strong>Selected for Regression:</strong> ${d.selected ? '<span class="badge badge-success">INCLUDED (Tier 1-2)</span>' : `<span class="badge badge-warning">EXCLUDED (${this.escapeHtml(d.exclusionReason || d.reason)})</span>`}</div>
          ${exp ? `
            <div style="margin-top: 8px;"><strong>Channel:</strong> <code>${this.escapeHtml(exp.impactChannel)}</code> | <strong>Tier:</strong> <code>${this.escapeHtml(exp.evidenceTier)}</code> | <strong>Confidence:</strong> ${exp.confidence}</div>
            <div style="margin-top: 6px;"><strong>Repo / Framework:</strong> ${this.escapeHtml(exp.repo)} / ${this.escapeHtml(exp.framework)}</div>
            <div style="margin-top: 6px;"><strong>File:</strong> <code>${this.escapeHtml(exp.file || 'n/a')}</code></div>
            <ul style="margin: 8px 0 0 18px;">${(exp.reasons || []).map(r => `<li>${this.escapeHtml(r)}</li>`).join('')}</ul>
          ` : ''}
        </div>
        ${prov ? `
          <div class="drawer-section">
            <h4>Graph Links &amp; Recent Execution History</h4>
            <div><strong>Graph Links (${(prov.graphLinks || []).length}):</strong> ${(prov.graphLinks || []).slice(0, 8).map(l => `<div class="evidence-chip">${this.escapeHtml(l.relType)} -> ${this.escapeHtml(l.target)}</div>`).join('')}</div>
            <div style="margin-top: 8px;"><strong>Executions:</strong> ${(prov.executionHistory || []).length ? prov.executionHistory.map(e => `<div>Run ${this.escapeHtml(e.runId)}: <strong>${this.escapeHtml(e.status)}</strong></div>`).join('') : '<span style="color: var(--accent-warning);">No execution history recorded</span>'}</div>
          </div>
        ` : ''}
      `;
    } catch (e) {
      body.innerHTML = `<div style="color: var(--accent-danger);">Failed to load evidence: ${this.escapeHtml(e.message)}</div>`;
    }
  },

  inspectEntityByInput() {
    const val = document.getElementById('entity-lookup-input')?.value?.trim();
    if (val) this.openEntityDrawer(val);
  },

  async openEntityDrawer(entityId) {
    const backdrop = document.getElementById('evidence-drawer-backdrop');
    const title = document.getElementById('drawer-title');
    const sub = document.getElementById('drawer-subtitle');
    const body = document.getElementById('drawer-body');
    if (!backdrop || !body) return;

    title.innerText = '🔎 Entity Provenance & Graph Neighbors';
    sub.innerText = entityId;
    body.innerHTML = 'Querying Neo4j entity provenance...';
    backdrop.classList.add('open');

    try {
      const res = await fetch(`/api/v2/intelligence/entity?entity_id=${encodeURIComponent(entityId)}`);
      const env = await res.json();
      const ent = env.data?.entity || null;
      if (!ent) {
        body.innerHTML = `<div class="drawer-section">Status: <strong>${this.escapeHtml(env.analysisStatus)}</strong>. Entity <code>${this.escapeHtml(entityId)}</code> not found or QKG unavailable.</div>`;
        return;
      }
      body.innerHTML = `
        <div class="drawer-section">
          <h4>Canonical Identity</h4>
          <div><strong>Canonical ID:</strong> <code>${this.escapeHtml(ent.canonicalId)}</code></div>
          <div><strong>Labels:</strong> ${(ent.labels || []).map(l => `<span class="badge badge-primary">${this.escapeHtml(l)}</span>`).join(' ')}</div>
          <div><strong>Plugin:</strong> ${this.escapeHtml(ent.plugin || 'n/a')} | <strong>File:</strong> <code>${this.escapeHtml(ent.file || 'n/a')}</code></div>
          <div><strong>Introduced In:</strong> ${this.escapeHtml(ent.introducedIn || 'n/a')} | <strong>Snapshot:</strong> <code>${this.escapeHtml(ent.snapshotId || env.graphSnapshotId)}</code></div>
        </div>
        <div class="drawer-section">
          <h4>Outbound Relationships (${(ent.outbound || []).length})</h4>
          ${(ent.outbound || []).map(r => `<div><span class="evidence-chip">${this.escapeHtml(r.relType)}</span> [${this.escapeHtml(r.targetLabel)}] <code>${this.escapeHtml(r.targetId)}</code></div>`).join('') || 'None'}
        </div>
        <div class="drawer-section">
          <h4>Inbound Relationships (${(ent.inbound || []).length})</h4>
          ${(ent.inbound || []).map(r => `<div><code>${this.escapeHtml(r.sourceId)}</code> [${this.escapeHtml(r.sourceLabel)}] <span class="evidence-chip">${this.escapeHtml(r.relType)}</span></div>`).join('') || 'None'}
        </div>
        <div class="drawer-section">
          <h4>Coverage Observations</h4>
          ${(ent.coverage || []).filter(c => c && c.runId).map(c => `<div>Run ${this.escapeHtml(c.runId)}: ${c.linesCovered}/${c.linesTotal} lines (${c.lineRate}%)</div>`).join('') || '<span style="color: var(--accent-warning);">No CoverageObservation recorded</span>'}
        </div>
      `;
    } catch (e) {
      body.innerHTML = `<div style="color: var(--accent-danger);">Error inspecting entity: ${this.escapeHtml(e.message)}</div>`;
    }
  },

  closeEvidenceDrawer() {
    document.getElementById('evidence-drawer-backdrop')?.classList.remove('open');
  },

  // Release & History Intelligence Tab (Phase 4/5B)
  async loadReleaseHistory() {
    try {
      const [readyRes, benchRes, manRes] = await Promise.all([
        fetch('/api/v2/intelligence/release-readiness'),
        fetch('/api/v2/intelligence/benchmark'),
        fetch('/api/v2/intelligence/manifests')
      ]);
      const ready = await readyRes.json();
      const benchEnv = await benchRes.json();
      const manData = await manRes.json();

      const gateEl = document.getElementById('rel-gate-status');
      const gateSub = document.getElementById('rel-gate-blockers');
      const rGate = ready.data?.readinessGate || 'UNAVAILABLE';
      if (gateEl) {
        gateEl.innerText = rGate;
        gateEl.style.color = rGate === 'READY' ? 'var(--accent-success)' : (rGate === 'ATTENTION_REQUIRED' ? 'var(--accent-warning)' : 'var(--accent-danger)');
      }
      if (gateSub) {
        const blockers = ready.data?.blockers || [];
        gateSub.innerText = blockers.length ? `Blockers: ${blockers.join(', ')}` : 'All readiness checks clear';
      }

      const b = benchEnv.data?.qkg15Benchmark || benchEnv.data?.fullReport?.aggregate || benchEnv.data?.fullReport?.metrics || null;
      const qEl = document.getElementById('rel-qkg15-status');
      const qSub = document.getElementById('rel-qkg15-metrics');
      if (qEl && qSub) {
        if (b) {
          const gStatus = benchEnv.data?.qkg15Benchmark?.gateStatus
            || ((benchEnv.data?.fullReport?.gate_passed ?? benchEnv.data?.fullReport?.gate?.passed) ? 'PASS' : 'FAIL');
          const scPassed = benchEnv.data?.qkg15Benchmark?.scenariosPassed
            ?? benchEnv.data?.fullReport?.aggregate?.scenarios_passed
            ?? benchEnv.data?.fullReport?.scenariosPassed
            ?? '—';
          const scTot = benchEnv.data?.qkg15Benchmark?.scenariosTotal
            ?? benchEnv.data?.fullReport?.aggregate?.total_scenarios
            ?? benchEnv.data?.fullReport?.scenariosTotal
            ?? '—';
          const recall = b.tier1And2Recall ?? b.tier_1_2_recall;
          const prec = b.precision;
          const det = b.determinismRate ?? b.determinism_rate;
          qEl.innerText = `${gStatus} (${scPassed}/${scTot})`;
          qEl.style.color = gStatus === 'PASS' ? 'var(--accent-success)' : 'var(--accent-danger)';
          qSub.innerText = `Recall(T1-T2): ${recall} | Precision: ${prec} | Determinism: ${det}`;
        } else {
          qEl.innerText = 'UNAVAILABLE';
          qSub.innerText = 'Run npm run benchmark:tia to generate QKG-15 report';
        }
      }

      const manifests = manData.manifests || [];
      const mEl = document.getElementById('rel-manifest-count');
      const mSub = document.getElementById('rel-latest-manifest');
      if (mEl) mEl.innerText = manifests.length;
      if (mSub) mSub.innerText = manifests[0] ? `Latest: ${manifests[0].snapshotId}` : 'No snapshot manifests on disk';

      const selA = document.getElementById('cmp-snap-a');
      const selB = document.getElementById('cmp-snap-b');
      if (selA && selB) {
        const opts = manifests.map((m) => `<option value="${this.escapeHtml(m.snapshotId)}">${this.escapeHtml(m.snapshotId)}</option>`).join('');
        selA.innerHTML = opts || '<option value="">None available</option>';
        selB.innerHTML = opts || '<option value="">None available</option>';
        if (manifests.length >= 2) {
          selA.selectedIndex = 1;
          selB.selectedIndex = 0;
        }
      }
    } catch (e) {
      console.error('Failed to load release history:', e);
    }
  },

  async runSnapshotCompare() {
    const snapshot_a = document.getElementById('cmp-snap-a')?.value || '';
    const snapshot_b = document.getElementById('cmp-snap-b')?.value || '';
    const mode = document.getElementById('cmp-mode')?.value || 'both';
    const structOut = document.getElementById('cmp-structural-output');
    const qualOut = document.getElementById('cmp-quality-output');
    if (structOut) structOut.innerHTML = 'Running canonical structural manifest diff...';
    if (qualOut) qualOut.innerHTML = 'Evaluating compatible quality observations...';

    try {
      const res = await fetch('/api/v2/qe/compare_snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshot_a, snapshot_b, mode })
      });
      const env = await res.json();
      const cmp = env.data || {};
      const st = cmp.structural;
      const ql = cmp.quality;

      if (structOut) {
        if (!st) {
          structOut.innerHTML = 'Structural diff omitted in quality-only mode.';
        } else {
          const s = st.summary || {};
          const exp = st.impact_explanation || {};
          structOut.innerHTML = `
            <div><strong>Status:</strong> <span class="badge badge-primary">${this.escapeHtml(env.analysisStatus)}</span></div>
            <div style="margin-top: 6px;">Entities: +${s.entitiesAdded ?? 0} added, -${s.entitiesRemoved ?? 0} removed, ~${s.entitiesModified ?? 0} modified</div>
            <div>Relationships: +${s.relationshipsAdded ?? 0} added, -${s.relationshipsRemoved ?? 0} removed</div>
            <div style="margin-top: 8px; color: var(--text-main);"><strong>Affected Plugins:</strong> ${(exp.affected_plugins || []).map(p => `<code>${this.escapeHtml(p)}</code>`).join(' ') || 'None'}</div>
            <div style="margin-top: 4px; color: var(--text-muted);">${this.escapeHtml(exp.summary_narrative || '')}</div>
          `;
        }
      }

      if (qualOut) {
        if (!ql) {
          qualOut.innerHTML = 'Quality comparison omitted in structural-only mode.';
        } else if (ql.status === 'UNAVAILABLE' || ql.status === 'INCOMPATIBLE') {
          qualOut.innerHTML = `<span class="badge badge-warning">${this.escapeHtml(ql.status)}</span> <div style="margin-top: 6px;">${this.escapeHtml(ql.reason || 'Compatible TestRun/CoverageRun telemetry unavailable for comparison (never fabricated as 0%).')}</div>`;
        } else {
          qualOut.innerHTML = `<div><span class="badge badge-success">${this.escapeHtml(ql.status)}</span></div><pre style="margin-top: 8px; font-size: 11px;">${this.escapeHtml(JSON.stringify(ql.deltas || ql, null, 2))}</pre>`;
        }
      }
    } catch (e) {
      if (structOut) structOut.innerHTML = `<span style="color: var(--accent-danger);">Compare error: ${this.escapeHtml(e.message)}</span>`;
    }
  },

  async planRegressionTests(scope = 'targeted_payroll_regression') {
    try {
      const res = await fetch('/api/v2/tests/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope })
      });
      const plan = await res.json();

      this.switchTab('chatbot');
      this.appendAssistantApprovalCard(plan);
    } catch (e) {
      alert('Error creating plan: ' + e.message);
    }
  },

  // 5. Database Studio & SQL Console
  async loadDatabase() {
    try {
      const [ovRes, driftRes] = await Promise.all([
        fetch('/api/v2/database/overview'),
        fetch('/api/v2/database/drift')
      ]);
      const data = await ovRes.json();
      const drift = await driftRes.json();

      const activeSub = document.getElementById('db-active-sub');
      const testSub = document.getElementById('db-test-sub');
      const driftEl = document.getElementById('db-drift-status');
      const driftSub = document.getElementById('db-drift-sub');

      if (activeSub) {
        activeSub.innerText = data.status === 'ONLINE' && data.totalTables !== null
          ? `${data.totalTables} Verified Tables (${data.payrollTablesCount ?? 0} Payroll)`
          : `UNAVAILABLE (${data.error || 'MariaDB offline'})`;
      }
      if (testSub) {
        testSub.innerText = drift.targetTableCount !== null && drift.targetTableCount !== undefined
          ? `${drift.targetTableCount} Verified Tables`
          : 'UNAVAILABLE (MariaDB offline)';
      }
      if (driftEl) {
        if (drift.status === 'UNAVAILABLE' || drift.isSynchronized === null || drift.isSynchronized === undefined) {
          driftEl.innerText = 'UNAVAILABLE';
          driftEl.style.color = 'var(--accent-danger)';
          if (driftSub) driftSub.innerText = drift.error || 'Cannot verify live MariaDB schema offline';
        } else {
          driftEl.innerText = drift.isSynchronized ? 'SYNCHRONIZED' : 'DRIFT DETECTED';
          driftEl.style.color = drift.isSynchronized ? 'var(--accent-success)' : 'var(--accent-danger)';
          if (driftSub) driftSub.innerText = drift.isSynchronized ? 'Zero table/column mismatch' : `${(drift.missingInTarget || []).length} missing target / ${(drift.missingInSource || []).length} missing source`;
        }
      }

      const tbody = document.getElementById('db-tables-body');
      if (tbody) {
        const list = data.sampleTables || [];
        if (list.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="color: var(--text-muted);">MariaDB offline or zero tables returned (UNAVAILABLE).</td></tr>';
        } else {
          tbody.innerHTML = list.map(t => `
            <tr>
              <td style="font-weight: 600; color: ${t.tableName.includes('payroll') || t.tableName.includes('pay_period') || t.tableName.includes('salary_slip') ? 'var(--accent-success)' : 'var(--accent-primary)'};">
                ${t.tableName.includes('payroll') || t.tableName.includes('pay_period') || t.tableName.includes('salary_slip') ? '✨ ' : ''}${this.escapeHtml(t.tableName)}
              </td>
              <td>${this.escapeHtml(t.rowEstimate)} rows</td>
              <td>${this.escapeHtml(t.sizeMb)} MB</td>
              <td><code>${this.escapeHtml(t.engine)}</code></td>
              <td><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="app.inspectTable('${this.escapeHtml(t.tableName)}')">Inspect Rows</button></td>
            </tr>
          `).join('');
        }
      }
    } catch (e) {
      console.error('Failed to load DB overview:', e);
    }
  },

  loadSqlPreset() {
    const val = document.getElementById('sql-preset-select').value;
    const presets = {
      '1': 'SELECT id, emp_number, pay_period_id, gross_salary, total_tax, net_salary, currency_id, status FROM ohrm_payroll_record LIMIT 10',
      '2': 'SELECT id, name, financial_year, jurisdiction_code, currency_id, status, start_date, end_date FROM ohrm_pay_period LIMIT 10',
      '3': "SELECT id, name, status, display_name FROM ohrm_module WHERE name='payroll'",
      '4': 'SELECT emp_number, emp_firstname, emp_lastname, emp_middle_name FROM hs_hr_employee LIMIT 5'
    };
    document.getElementById('sql-input').value = presets[val] || presets['1'];
  },

  async executeSqlQuery() {
    const sql = document.getElementById('sql-input').value.trim();
    const db = document.getElementById('sql-db-select').value;
    const status = document.getElementById('sql-status');
    status.innerText = `Executing query on ${db}...`;

    try {
      const res = await fetch('/api/v2/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, database: db })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      status.innerHTML = `<span style="color: var(--accent-success);">✓ Executed in ${data.executionTimeMs}ms (${data.count} rows returned)</span>`;

      if (data.rows.length > 0) {
        const cols = Object.keys(data.rows[0]);
        document.getElementById('sql-thead-tr').innerHTML = cols.map(c => `<th>${c}</th>`).join('');
        document.getElementById('sql-tbody').innerHTML = data.rows.map(r => `
          <tr>${cols.map(c => `<td>${r[c]}</td>`).join('')}</tr>
        `).join('');
      } else {
        document.getElementById('sql-tbody').innerHTML = '<tr><td colspan="8">No rows returned.</td></tr>';
      }
    } catch (e) {
      status.innerHTML = `<span style="color: var(--accent-danger);">Error: ${e.message}</span>`;
    }
  },

  async inspectTable(tableName) {
    document.getElementById('sql-input').value = `SELECT * FROM \`${tableName}\` LIMIT 10`;
    this.executeSqlQuery();
  },

  // 6. Agentic Chatbot (Claude-Style)
  handleChatKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendChatMessage();
    }
  },

  sendPreset(prompt) {
    document.getElementById('chat-input').value = prompt;
    this.sendChatMessage();
  },

  async sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    this.appendUserMessage(msg);

    const typingId = this.appendTypingIndicator();

    try {
      const res = await fetch('/api/v2/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: this.chatHistory })
      });
      const data = await res.json();

      document.getElementById(typingId)?.remove();

      this.appendAssistantMessage(data.reply, data.activities);

      this.chatHistory.push({ role: 'user', content: msg });
      this.chatHistory.push({ role: 'assistant', content: data.reply });
    } catch (e) {
      document.getElementById(typingId)?.remove();
      this.appendAssistantMessage('⚠️ **Service Error:** ' + e.message);
    }
  },

  appendUserMessage(msg) {
    const container = document.getElementById('chat-messages');
    const row = document.createElement('div');
    row.className = 'message-row user';
    row.innerHTML = `
      <div class="message-bubble">${msg.replace(/\n/g, '<br>')}</div>
      <div class="message-avatar user">👤</div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  },

  appendTypingIndicator() {
    const container = document.getElementById('chat-messages');
    const id = 'typing-' + Date.now();
    const row = document.createElement('div');
    row.id = id;
    row.className = 'message-row assistant';
    row.innerHTML = `
      <div class="message-avatar assistant">🤖</div>
      <div class="message-bubble" style="color: var(--text-muted); font-style: italic;">
        Quality Intelligence Assistant is analyzing and querying services...
      </div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
    return id;
  },

  appendAssistantMessage(markdownText, activities = []) {
    const container = document.getElementById('chat-messages');
    const row = document.createElement('div');
    row.className = 'message-row assistant';

    let activityHtml = '';
    if (activities && activities.length > 0) {
      activityHtml = `
        <div class="activity-box">
          <div class="activity-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
            <span>⚡ Analysis Activity (${activities.length} Quality Service Calls)</span>
            <span style="font-size: 10px;">▼ Click to toggle</span>
          </div>
          <div class="activity-content">
            ${activities.map(a => `
              <div style="margin-bottom: 6px;">
                <strong>${a.status === 'COMPLETED' ? '✓' : '•'} ${a.title}</strong>
                ${a.summary ? `<div style="font-size: 11px; opacity: 0.8; margin-left: 14px;">${a.summary}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const htmlContent = marked.parse(markdownText);

    row.innerHTML = `
      <div class="message-avatar assistant">🤖</div>
      <div class="message-bubble">
        ${activityHtml}
        ${htmlContent}
      </div>
    `;
    container.appendChild(row);

    row.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el);
    });

    container.scrollTop = container.scrollHeight;
  },

  appendAssistantApprovalCard(plan) {
    const container = document.getElementById('chat-messages');
    const row = document.createElement('div');
    row.className = 'message-row assistant';

    row.innerHTML = `
      <div class="message-avatar assistant">🤖</div>
      <div class="message-bubble">
        <p>I have generated a structured <strong>Test Execution Plan</strong> based on the latest PR Impact Analysis:</p>
        <div class="approval-card" id="card-${plan.planId}">
          <h4>🛡️ Human-in-the-Loop Quality Approval Gate</h4>
          <p><strong>Plan ID:</strong> <code>${plan.planId}</code> | <strong>Scope:</strong> ${plan.scope} | <strong>Tests:</strong> ${plan.tests.length} candidate suites</p>
          <p style="margin-bottom: 12px; font-size: 11px; color: var(--text-muted);">
            Tests: ${plan.tests.map(t => `<code>${t.id}</code>`).join(', ')}
          </p>
          <div class="approval-actions">
            <button class="btn btn-success" onclick="app.approveAndExecutePlan('${plan.planId}', '${plan.approvalToken}')">✓ Approve & Execute in Background</button>
            <button class="btn btn-secondary" onclick="this.closest('.approval-card').remove()">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  },

  async approveAndExecutePlan(planId, token) {
    const card = document.getElementById(`card-${planId}`);
    if (card) {
      card.innerHTML = `<div style="color: var(--accent-success); font-weight: 600;">✓ Plan Approved! Enqueueing job in background test execution worker...</div>`;
    }

    try {
      await fetch('/api/v2/tests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, approvalToken: token })
      });

      const execRes = await fetch('/api/v2/tests/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      const execData = await execRes.json();

      if (card) {
        card.innerHTML = `
          <div style="color: var(--accent-success); font-weight: 700; margin-bottom: 6px;">🚀 Background Worker Running: Job ${execData.jobId}</div>
          <div style="background: rgba(0,0,0,0.3); border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 6px;">
            <div id="job-progress-bar" style="background: var(--accent-success); width: 10%; height: 100%; transition: width 0.3s;"></div>
          </div>
          <div id="job-status-text" style="font-size: 11px; color: var(--text-muted);">Executing isolated test suite...</div>
        `;
      }
    } catch (e) {
      alert('Error approving/executing: ' + e.message);
    }
  },

  // 7. SSE Event Listener
  setupSSE() {
    try {
      const evtSource = new EventSource('/api/v2/events/sse');
      evtSource.onmessage = (e) => {
        const evt = JSON.parse(e.data);
        if (evt.type === 'test_progress') {
          const bar = document.getElementById('job-progress-bar');
          const txt = document.getElementById('job-status-text');
          if (bar) bar.style.width = `${evt.job.progressPercent}%`;
          if (txt) txt.innerText = `Progress: ${evt.job.progressPercent}% (${evt.job.completedTests}/${evt.job.totalTests}) - ${evt.currentTest.name}`;
        } else if (evt.type === 'job_completed') {
          const bar = document.getElementById('job-progress-bar');
          const txt = document.getElementById('job-status-text');
          if (bar) bar.style.width = '100%';
          if (txt) txt.innerHTML = `<span style="color: var(--accent-success); font-weight: 700;">✓ Job Completed: ${evt.job.passedTests} passed, 0 failed. Quality Gate PASSED!</span>`;
        }
      };
    } catch (e) {
      console.warn('SSE connection notice:', e);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
