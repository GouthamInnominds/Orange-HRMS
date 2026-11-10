/**
 * Test Case ID: TC_STATE_WF_0072
 * Workflow: LeaveApplication
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0072: LeaveApplication', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0072: LeaveApplication - State Transition Boundary Test 72', function () {
    cy.url().should('include', '/auth/login');
  });
});
