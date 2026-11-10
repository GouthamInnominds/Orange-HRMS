const neo4jService = require('./neo4j_service');
const githubService = require('./github_service');

class TIAService {
  constructor() {
    this.weights = {
      methodImpact: 0.25,
      requirementImpact: 0.30,
      dependentClasses: 0.20,
      historicalFailures: 0.15,
      coverageGap: 0.10
    };
  }

  calculateRiskScore(metrics) {
    const rawScore = 
      (metrics.affectedMethods * 6 * this.weights.methodImpact) +
      (metrics.affectedRequirements * 15 * this.weights.requirementImpact) +
      (metrics.dependentClasses * 8 * this.weights.dependentClasses) +
      (metrics.historicalFailures * 10 * this.weights.historicalFailures) +
      (metrics.coverageGap * 100 * this.weights.coverageGap);

    const normalized = Math.min(100, Math.max(0, Math.round(rawScore)));
    
    let gateStatus = 'GREEN';
    let recommendation = 'Low risk change. Standard smoke verification recommended.';

    if (normalized >= 70) {
      gateStatus = 'RED';
      recommendation = 'High risk change impacting critical statutory financial logic. Full regression suite and QA sign-off required.';
    } else if (normalized >= 30) {
      gateStatus = 'AMBER';
      recommendation = 'Elevated risk. Execute targeted regression test suites for Payroll and affected PIM integrations.';
    }

    return {
      score: normalized,
      gateStatus,
      recommendation
    };
  }

  async analyzePullRequest(prNumber = 12) {
    const prDetails = githubService.getPullRequestDetails(prNumber);
    const files = prDetails.changedFiles || [];

    return await this.analyzeFiles(files, prDetails);
  }

  async analyzeFiles(files, context = {}) {
    const affectedComponents = [];
    const affectedRequirements = [];
    const candidateTests = [];

    // Map changed files to QKG entities and tests
    files.forEach(file => {
      if (file.includes('Payroll') || file.includes('payroll')) {
        affectedComponents.push({
          file,
          type: file.includes('Controller') ? 'Controller' : file.includes('entity') ? 'Entity' : 'Service',
          name: file.split('/').pop().replace('.php', '').replace('.vue', '')
        });
      }
    });

    if (affectedComponents.length > 0) {
      affectedRequirements.push(
        { id: 'REQ-PAY-01', title: 'Automated Gross to Net Calculation Engine', criticality: 'CRITICAL' },
        { id: 'REQ-PAY-02', title: 'Statutory EPF 8% & PAYE 15% Withholding', criticality: 'CRITICAL' },
        { id: 'REQ-PAY-03', title: 'Pay Period Locking & Record Immutability', criticality: 'HIGH' },
        { id: 'REQ-PAY-04', title: 'Self-Service Employee Salary Slip Download', criticality: 'MEDIUM' }
      );

      candidateTests.push(
        { id: 'TC_PAY_001', name: 'Contract: POST /api/v2/payroll/pay-periods/{id}/calculate', suite: 'TS_Payroll_Contract', priority: 'P1', estSec: 2 },
        { id: 'TC_PAY_002', name: 'Functional: Verify Statutory Deduction Formulas (EPF & PAYE)', suite: 'TS_Payroll_Formulas', priority: 'P1', estSec: 3 },
        { id: 'TC_PAY_003', name: 'Security: Pay Period Locking Prevents Recalculation', suite: 'TS_Payroll_Locking', priority: 'P1', estSec: 2 },
        { id: 'TC_PAY_004', name: 'DB Integrity: hs_hr_payroll_record Foreign Key Audit', suite: 'TS_DB_Integrity', priority: 'P2', estSec: 1 },
        { id: 'TC_PAY_005', name: 'UI Sanity: Payroll Dashboard & Slip Generation Render', suite: 'TS_UI_Sanity', priority: 'P2', estSec: 4 },
        { id: 'TC_PIM_INT_001', name: 'Integration: PIM Active Employee Salary Sync', suite: 'TS_PIM_Integration', priority: 'P2', estSec: 3 }
      );
    } else {
      candidateTests.push(
        { id: 'TC_SMOKE_001', name: 'System Smoke & Login Sanity Test', suite: 'TS_Smoke', priority: 'P1', estSec: 2 }
      );
    }

    const riskMetrics = {
      affectedMethods: affectedComponents.length * 2,
      affectedRequirements: affectedRequirements.length,
      dependentClasses: 4,
      historicalFailures: 0,
      coverageGap: 0.05
    };

    const risk = this.calculateRiskScore(riskMetrics);

    return {
      timestamp: new Date().toISOString(),
      prContext: context.title || 'Direct File Diff Analysis',
      analyzedFiles: files,
      affectedComponents,
      affectedRequirements,
      candidateTests,
      riskAssessment: {
        ...risk,
        metrics: riskMetrics
      },
      summary: {
        totalFiles: files.length,
        totalRequirementsImpacted: affectedRequirements.length,
        candidateTestsCount: candidateTests.length,
        totalEstimatedRuntimeSec: candidateTests.reduce((acc, t) => acc + t.estSec, 0)
      }
    };
  }
}

module.exports = new TIAService();
