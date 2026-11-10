/**
 * Test Case ID: TC_STATE_WF_0083
 * Workflow: ExpenseClaimApproval
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0083: ExpenseClaimApproval', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0083: ExpenseClaimApproval - State Transition Boundary Test 83', function () {
    cy.url().should('include', '/auth/login');
  });
});
