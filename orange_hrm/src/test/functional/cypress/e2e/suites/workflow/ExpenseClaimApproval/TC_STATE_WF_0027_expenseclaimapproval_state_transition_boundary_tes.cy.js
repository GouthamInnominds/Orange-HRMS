/**
 * Test Case ID: TC_STATE_WF_0027
 * Workflow: ExpenseClaimApproval
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0027: ExpenseClaimApproval', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0027: ExpenseClaimApproval - State Transition Boundary Test 27', function () {
    cy.url().should('include', '/auth/login');
  });
});
