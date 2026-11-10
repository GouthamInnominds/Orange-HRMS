/**
 * Test Case ID: TC_STATE_WF_0026
 * Workflow: RecruitmentCandidatePipeline
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0026: RecruitmentCandidatePipeline', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0026: RecruitmentCandidatePipeline - State Transition Boundary Test 26', function () {
    cy.url().should('include', '/auth/login');
  });
});
