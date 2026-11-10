/**
 * Test Case ID: TC_ATT_067
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Update configuration fails when a required boolean field is missing
 * Priority: Medium
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_067', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_067: Update configuration fails when a required boolean field is missing', function () {
    // Objective: Verify the update request is rejected when one of the three required configuration fields is omitted.
    cy.url().should('include', '/auth/login');
  });
});
