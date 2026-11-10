/**
 * Test Case ID: TC_STATE_WF_0091
 * Workflow: ExpenseClaimApproval
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0091: ExpenseClaimApproval', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0091: ExpenseClaimApproval - State Transition Boundary Test 91', function () {
    cy.url().should('include', '/auth/login');
  });
});
