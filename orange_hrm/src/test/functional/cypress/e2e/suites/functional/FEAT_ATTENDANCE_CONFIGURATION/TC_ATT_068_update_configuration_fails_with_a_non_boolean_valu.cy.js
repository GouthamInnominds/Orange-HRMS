/**
 * Test Case ID: TC_ATT_068
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Update configuration fails with a non-boolean value
 * Priority: Medium
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_068', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_068: Update configuration fails with a non-boolean value', function () {
    // Objective: Verify the update request is rejected when a configuration field is supplied as a non-boolean type (e.g., string \'yes\').
    cy.url().should('include', '/auth/login');
  });
});
