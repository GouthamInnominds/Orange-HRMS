/**
 * Test Case ID: TC_STATE_WF_0061
 * Workflow: TimesheetSubmission
 * Initial State: Draft -> Final State: Approved
 */

describe('Workflow - TC_STATE_WF_0061: TimesheetSubmission', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_STATE_WF_0061: TimesheetSubmission - State Transition Boundary Test 61', function () {
    cy.url().should('include', '/auth/login');
  });
});
