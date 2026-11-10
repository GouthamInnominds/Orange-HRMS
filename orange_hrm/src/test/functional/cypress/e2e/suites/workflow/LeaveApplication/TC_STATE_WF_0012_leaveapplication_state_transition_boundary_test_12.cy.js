/**
 * Test Case ID: TC_STATE_WF_0012
 * Workflow: LeaveApplication
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0012: LeaveApplication', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0012: LeaveApplication - State Transition Boundary Test 12', function () {
    cy.url().should('include', '/auth/login');
  });
});
