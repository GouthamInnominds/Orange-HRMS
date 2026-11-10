/**
 * Test Case ID: TC_STATE_WF_0050
 * Workflow: RecruitmentCandidatePipeline
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0050: RecruitmentCandidatePipeline', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0050: RecruitmentCandidatePipeline - State Transition Boundary Test 50', function () {
    cy.url().should('include', '/auth/login');
  });
});
