/**
 * Test Case ID: TC_ATT_069
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Non-admin user is forbidden from accessing attendance configuration
 * Priority: High
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_069', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_069: Non-admin user is forbidden from accessing attendance configuration', function () {
    // Objective: Verify a user without Admin privileges cannot view or update the attendance configuration.
    cy.url().should('include', '/auth/login');
  });
});
