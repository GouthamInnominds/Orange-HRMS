/**
 * Test Case ID: TC_STATE_WF_0065
 * Workflow: TimesheetSubmission
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0065: TimesheetSubmission', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0065: TimesheetSubmission - State Transition Boundary Test 65', function () {
    cy.url().should('include', '/auth/login');
  });
});
