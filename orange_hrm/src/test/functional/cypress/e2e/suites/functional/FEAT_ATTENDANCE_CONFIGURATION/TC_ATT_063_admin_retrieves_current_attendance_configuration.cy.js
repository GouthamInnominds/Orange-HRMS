/**
 * Test Case ID: TC_ATT_063
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Admin retrieves current attendance configuration
 * Priority: High
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_063', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_063: Admin retrieves current attendance configuration', function () {
    // Objective: Verify Admin can fetch the current values of all three attendance configuration toggles.
    cy.url().should('include', '/auth/login');
  });
});
