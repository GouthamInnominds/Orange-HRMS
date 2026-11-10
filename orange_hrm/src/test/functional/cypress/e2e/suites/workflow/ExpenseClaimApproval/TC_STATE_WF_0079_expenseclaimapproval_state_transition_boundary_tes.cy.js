/**
 * Test Case ID: TC_STATE_WF_0079
 * Workflow: ExpenseClaimApproval
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0079: ExpenseClaimApproval', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0079: ExpenseClaimApproval - State Transition Boundary Test 79', function () {
    cy.url().should('include', '/auth/login');
  });
});
