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
        { id: 'FR_PAY_004', title: 'Idempotent Runs & Immutable PIM Employee Snapshots', criticality: 'CRITICAL' },
        { id: 'FR_PAY_007', title: 'India Statutory (EPF/ESIC/PT) & FY 2026-27 TDS (115BAC/Old)', criticality: 'CRITICAL' },
        { id: 'FR_PAY_010', title: 'Maker-Checker Separation of Duties & Run Locking', criticality: 'HIGH' },
        { id: 'FR_PAY_011', title: 'NEFT Bank CSV Guard & UTR Claim PAID Settlement', criticality: 'HIGH' },
        { id: 'FR_PAY_012', title: 'ESS INR HTML Payslip Preview & Strict BOLA/IDOR Isolation', criticality: 'HIGH' }
      );

      candidateTests.push(
        { id: 'TC_PAY_UNIT_006', name: 'IndianStatutoryCalculatorTest::testEpfCapToggleSplitsEpsAndDiffCorrectly', suite: 'IndianStatutoryCalculatorTest', priority: 'P1', estSec: 1 },
        { id: 'TC_PAY_UNIT_009', name: 'IndianStatutoryCalculatorTest::testFy2026TdsNewVsOldRegimeRebateCessAndLwpProRata', suite: 'IndianStatutoryCalculatorTest', priority: 'P1', estSec: 1 },
        { id: 'TC_PAY_INT_004', name: 'PayrollWorkflowAndStatutoryIntegrationTest::testWorkflowSeparationOfDutiesAndLifecycleGuards', suite: 'PayrollWorkflowAndStatutoryIntegrationTest', priority: 'P1', estSec: 1 },
        { id: 'E2E-CALC-02', name: 'E2E-CALC-02: Verify PIM/Leave/Time/Claim/EPF/ESIC/PT/TDS/Masking/Skips', suite: 'India_Payroll_E2E_Suite', priority: 'P1', estSec: 9 },
        { id: 'E2E-WF-01', name: 'E2E-WF-01: Submit -> Self-Approve 403 -> Reject -> Resubmit -> Approve -> Lock', suite: 'India_Payroll_E2E_Suite', priority: 'P1', estSec: 35 },
        { id: 'E2E-PAY-01', name: 'E2E-PAY-01: NEFT Missing-Bank Guard -> Export CSV -> UTR Reconcile -> Claim PAID', suite: 'India_Payroll_E2E_Suite', priority: 'P1', estSec: 36 },
        { id: 'UI-ESS-01', name: 'UI-ESS-01: ESS My Salary Slips Table & Interactive Payslip Preview Modal', suite: 'Playwright_OXD_UI_Suite', priority: 'P1', estSec: 63 }
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

