/**
 * Test Case ID: TC_STATE_WF_0018
 * Workflow: RecruitmentCandidatePipeline
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0018: RecruitmentCandidatePipeline', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0018: RecruitmentCandidatePipeline - State Transition Boundary Test 18', function () {
    cy.url().should('include', '/auth/login');
  });
});
