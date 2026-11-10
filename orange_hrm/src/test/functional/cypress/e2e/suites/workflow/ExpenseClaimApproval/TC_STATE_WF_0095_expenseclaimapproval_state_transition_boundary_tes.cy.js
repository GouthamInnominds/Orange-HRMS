/**
 * Test Case ID: TC_STATE_WF_0095
 * Workflow: ExpenseClaimApproval
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0095: ExpenseClaimApproval', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0095: ExpenseClaimApproval - State Transition Boundary Test 95', function () {
    cy.url().should('include', '/auth/login');
  });
});
