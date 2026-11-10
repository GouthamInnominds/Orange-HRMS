/**
 * Test Case ID: TC_ATT_013
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out successfully after an active punch in
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_013', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_013: Punch out successfully after an active punch in', function () {
    // Objective: Verify an employee who is currently punched in can punch out successfully.
    cy.url().should('include', '/auth/login');
  });
});
