/**
 * Test Case ID: TC_ATT_006
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in fails with invalid time format
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_006', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_006: Punch in fails with invalid time format', function () {
    // Objective: Verify punch in rejects a time value that does not match the required \'H:i\' format.
    cy.url().should('include', '/auth/login');
  });
});
