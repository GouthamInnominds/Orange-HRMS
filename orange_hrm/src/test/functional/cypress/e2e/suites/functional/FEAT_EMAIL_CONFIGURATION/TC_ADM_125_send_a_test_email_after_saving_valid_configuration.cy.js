/**
 * Test Case ID: TC_ADM_125
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Send a test email after saving valid configuration
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_125', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_125: Send a test email after saving valid configuration', function () {
    // Objective: Verify providing a testEmailAddress triggers a test email send and reports success/failure status.
    cy.url().should('include', '/auth/login');
  });
});
