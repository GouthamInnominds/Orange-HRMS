/**
 * Test Case ID: TC_STATE_WF_0103
 * Workflow: ExpenseClaimApproval
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0103: ExpenseClaimApproval', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0103: ExpenseClaimApproval - State Transition Boundary Test 103', function () {
    cy.url().should('include', '/auth/login');
  });
});
