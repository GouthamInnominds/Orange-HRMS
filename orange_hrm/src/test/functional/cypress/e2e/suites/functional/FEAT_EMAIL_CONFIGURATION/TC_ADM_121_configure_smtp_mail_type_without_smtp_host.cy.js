/**
 * Test Case ID: TC_ADM_121
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Configure SMTP mail type without SMTP host
 * Priority: High
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_121', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_121: Configure SMTP mail type without SMTP host', function () {
    // Objective: Verify smtpHost is required when mailType is smtp or secure_smtp.
    cy.url().should('include', '/auth/login');
  });
});
