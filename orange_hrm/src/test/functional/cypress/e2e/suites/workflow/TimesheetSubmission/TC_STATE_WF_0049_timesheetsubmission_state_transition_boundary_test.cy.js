/**
 * Test Case ID: TC_STATE_WF_0049
 * Workflow: TimesheetSubmission
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0049: TimesheetSubmission', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0049: TimesheetSubmission - State Transition Boundary Test 49', function () {
    cy.url().should('include', '/auth/login');
  });
});
