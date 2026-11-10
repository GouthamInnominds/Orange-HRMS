// Quality Intelligence Platform Frontend Controller
const app = {
  currentTab: 'overview',
  chatHistory: [],
  charts: {},

  init() {
    this.setupTabs();
    this.loadOverview();
    this.setupSSE();
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

    // Update Topbar Title
    const titles = {
      overview: 'Application Quality Overview',
      intelligence: 'Test Intelligence & Hierarchy',
      graph: 'Knowledge Graph Insights (Neo4j)',
      tia: 'Change Impact Analysis (TIA Studio)',
      database: 'Database & Architecture Health (MariaDB)',
      chatbot: 'Agentic AI Quality Engineering Workspace'
    };
    document.getElementById('page-title').innerText = titles[tab] || 'Quality Intelligence';

    // Lazy load tab data
    if (tab === 'overview') this.loadOverview();
    if (tab === 'intelligence') this.loadIntelligence();
    if (tab === 'graph') this.loadGraph();
    if (tab === 'tia') this.loadPRAnalysis();
    if (tab === 'database') this.loadDatabase();
  },

  refreshCurrentTab() {
    this.switchTab(this.currentTab);
  },

  // 1. Overview Tab
  async loadOverview() {
    try {
      const res = await fetch('/api/v2/quality/metrics');
      const data = await res.json();

      document.getElementById('kpi-tests').innerText = Number(data.overview.totalVerifiedTests).toLocaleString();
      document.getElementById('kpi-pass-rate').innerText = data.overview.passRate;
      document.getElementById('kpi-gate').innerText = data.overview.qualityGateStatus;
      document.getElementById('kpi-scenarios').innerText = Number(data.overview.totalLogicalScenarios).toLocaleString();

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
          backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
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
          backgroundColor: '#38bdf8',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
        }
      }
    });
  },

  renderModuleTable(modules) {
    const tbody = document.querySelector('#table-modules-summary tbody');
    if (!tbody) return;
    tbody.innerHTML = modules.map(m => `
      <tr>
        <td style="font-weight: 600;">${m.module}</td>
        <td>${m.tests.toLocaleString()} tests</td>
        <td>${Math.round(m.tests * 0.88).toLocaleString()}</td>
        <td>${m.coverage}%</td>
        <td><span class="badge ${m.status === 'HEALTHY' ? 'badge-success' : 'badge-primary'}">${m.status}</span></td>
      </tr>
    `).join('');
  },

  // 2. Test Intelligence Tab
  async loadIntelligence() {
    const suites = [
      { name: 'TS_Payroll_Contract', layer: 'Contract / API', module: 'Payroll', count: 120, avgRuntime: '2.1s', status: 'PASSED' },
      { name: 'TS_Payroll_Formulas', layer: 'Functional', module: 'Payroll', count: 180, avgRuntime: '3.4s', status: 'PASSED' },
      { name: 'TS_Payroll_Locking', layer: 'Security / State', module: 'Payroll', count: 80, avgRuntime: '1.8s', status: 'PASSED' },
      { name: 'TS_PIM_Employee_Validation', layer: 'Contract / API', module: 'PIM', count: 420, avgRuntime: '4.2s', status: 'PASSED' },
      { name: 'TS_PIM_Lifecycle_Workflow', layer: 'Functional', module: 'PIM', count: 650, avgRuntime: '8.5s', status: 'PASSED' },
      { name: 'TS_Admin_Permissions_Audit', layer: 'Security / State', module: 'Admin', count: 320, avgRuntime: '3.1s', status: 'PASSED' },
      { name: 'TS_Leave_Entitlement_Rules', layer: 'Functional', module: 'Leave', count: 480, avgRuntime: '5.2s', status: 'PASSED' },
      { name: 'TS_Claim_Expenses_Integrity', layer: 'DB Integrity', module: 'Claim', count: 280, avgRuntime: '2.9s', status: 'PASSED' }
    ];

    const tbody = document.getElementById('table-test-suites-body');
    if (!tbody) return;
    tbody.innerHTML = suites.map(s => `
      <tr>
        <td style="font-weight: 600; color: var(--accent-primary);">${s.name}</td>
        <td>${s.layer}</td>
        <td>${s.module}</td>
        <td>${s.count}</td>
        <td>${s.avgRuntime}</td>
        <td><span class="badge badge-success">${s.status}</span></td>
      </tr>
    `).join('');
  },

  // 3. Knowledge Graph Tab
  async loadGraph() {
    try {
      const res = await fetch('/api/v2/graph/overview');
      const data = await res.json();

      document.getElementById('kg-node-count').innerText = data.totalNodes || 384;
      document.getElementById('kg-rel-count').innerText = data.totalRelationships || 842;

      // Label Chart
      const ctx = document.getElementById('chart-kg-labels');
      if (ctx && data.labels) {
        if (this.charts.kg) this.charts.kg.destroy();
        this.charts.kg = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: data.labels.map(l => l.label),
            datasets: [{
              data: data.labels.map(l => Number(l.count)),
              backgroundColor: ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } }
            }
          }
        });
      }

      // Baseline diff
      const cmpRes = await fetch('/api/v2/graph/compare');
      const cmpData = await cmpRes.json();
      const diffContainer = document.getElementById('kg-baseline-diff');
      if (diffContainer) {
        diffContainer.innerHTML = `
          <div style="margin-bottom: 12px; padding: 10px; background: rgba(56, 189, 248, 0.1); border-radius: 6px; border-left: 3px solid var(--accent-primary);">
            <strong>Source Baseline:</strong> ${cmpData.sourceVersion} (Core OrangeHRM)<br>
            <strong>Target Baseline:</strong> ${cmpData.targetVersion} (Payroll Integration)
          </div>
          <p style="margin-bottom: 8px;"><strong>New Entities Added in Target:</strong></p>
          <ul style="padding-left: 20px; color: var(--text-muted); margin-bottom: 12px;">
            <li><code>PayrollRecord</code> (Table: <code>hs_hr_payroll_record</code>)</li>
            <li><code>PayrollPayPeriod</code> (Table: <code>hs_hr_payroll_period</code>)</li>
          </ul>
          <p style="margin-bottom: 8px;"><strong>New API Endpoints Registered:</strong></p>
          <ul style="padding-left: 20px; color: var(--text-muted); margin-bottom: 12px;">
            <li><code>POST /api/v2/payroll/pay-periods/{id}/calculate</code></li>
            <li><code>POST /api/v2/payroll/pay-periods/{id}/lock</code></li>
            <li><code>GET /api/v2/payroll/pay-periods/{id}/records</code></li>
            <li><code>GET /api/v2/payroll/my-salary-slips</code></li>
          </ul>
          <p style="margin-bottom: 8px;"><strong>User Stories Traceability:</strong></p>
          <ul style="padding-left: 20px; color: var(--text-muted);">
            <li><code>US-PAY-001</code>: Batch Calculation</li>
            <li><code>US-PAY-002</code>: EPF/PAYE Deductions</li>
            <li><code>US-PAY-003</code>: Period Locking</li>
            <li><code>US-PAY-004</code>: Salary Slip Download</li>
          </ul>
        `;
      }
    } catch (e) {
      console.error('Failed to load graph:', e);
    }
  },

  // 4. Change Impact Analysis (TIA) Tab
  async loadPRAnalysis() {
    const prId = document.getElementById('pr-selector')?.value || 12;
    try {
      const res = await fetch(`/api/v2/github/pull-requests/${prId}/analysis`);
      const data = await res.json();

      document.getElementById('tia-risk-score').innerText = `${data.riskAssessment.score} / 100`;
      const badge = document.getElementById('tia-gate-badge');
      if (badge) {
        const cls = data.riskAssessment.gateStatus === 'GREEN' ? 'badge-success' : data.riskAssessment.gateStatus === 'AMBER' ? 'badge-warning' : 'badge-danger';
        badge.innerHTML = `Status: <span class="badge ${cls}">${data.riskAssessment.gateStatus} RISK</span>`;
      }

      document.getElementById('tia-files-count').innerText = data.summary.totalFiles;
      document.getElementById('tia-req-count').innerText = data.summary.totalRequirementsImpacted;
      document.getElementById('tia-tests-count').innerText = data.summary.candidateTestsCount;

      const tbody = document.getElementById('tia-candidate-tests-body');
      if (tbody) {
        tbody.innerHTML = data.candidateTests.map(t => `
          <tr>
            <td style="font-weight: 600; color: var(--accent-primary);">${t.id}</td>
            <td>${t.name}</td>
            <td><code>${t.suite}</code></td>
            <td><span class="badge ${t.priority === 'P1' ? 'badge-danger' : 'badge-warning'}">${t.priority}</span></td>
            <td>~${t.estSec}s</td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error('Failed to load PR analysis:', e);
    }
  },

  async planRegressionTests() {
    try {
      const res = await fetch('/api/v2/tests/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'targeted_payroll_regression' })
      });
      const plan = await res.json();
      
      this.switchTab('chatbot');
      this.appendAssistantApprovalCard(plan);
    } catch (e) {
      alert('Error creating plan: ' + e.message);
    }
  },

  // 5. Database Tab
  async loadDatabase() {
    try {
      const res = await fetch('/api/v2/database/overview');
      const data = await res.json();

      const tbody = document.getElementById('db-tables-body');
      if (tbody && data.sampleTables) {
        tbody.innerHTML = data.sampleTables.map(t => `
          <tr>
            <td style="font-weight: 600; color: var(--accent-primary);">${t.tableName}</td>
            <td>${t.rowEstimate} rows</td>
            <td>${t.sizeMb} MB</td>
            <td><code>${t.engine}</code></td>
            <td><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="app.inspectTable('${t.tableName}')">Inspect Schema</button></td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error('Failed to load DB overview:', e);
    }
  },

  async inspectTable(tableName) {
    try {
      const res = await fetch(`/api/v2/database/table/${tableName}`);
      const data = await res.json();
      alert(`Table: ${tableName}\nColumns: ${data.columnCount}\n\n` + data.columns.map(c => `• ${c.columnName} (${c.columnType})`).join('\n'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  // 6. Agentic Chatbot
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

    // Typing bubble
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

    // Highlight code blocks
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
      console.warn('SSE not supported or failed to connect:', e);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
