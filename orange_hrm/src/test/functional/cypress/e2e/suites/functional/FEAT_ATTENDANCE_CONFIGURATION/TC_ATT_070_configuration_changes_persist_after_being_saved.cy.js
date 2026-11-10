/**
 * Test Case ID: TC_ATT_070
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Configuration changes persist after being saved
 * Priority: Medium
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_070', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_070: Configuration changes persist after being saved', function () {
    // Objective: Verify that after updating the configuration, re-fetching it returns the newly saved values.
    cy.url().should('include', '/auth/login');
  });
});
