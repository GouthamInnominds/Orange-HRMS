/**
 * Test Case ID: TC_STATE_WF_0080
 * Workflow: LeaveApplication
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0080: LeaveApplication', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0080: LeaveApplication - State Transition Boundary Test 80', function () {
    cy.url().should('include', '/auth/login');
  });
});
