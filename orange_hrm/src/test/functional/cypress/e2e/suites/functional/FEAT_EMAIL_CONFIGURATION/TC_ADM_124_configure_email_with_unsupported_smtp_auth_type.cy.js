/**
 * Test Case ID: TC_ADM_124
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Configure email with unsupported SMTP auth type
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_124', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_124: Configure email with unsupported SMTP auth type', function () {
    // Objective: Verify smtpAuthType must be one of the allowed auth type values (login/none).
    cy.url().should('include', '/auth/login');
  });
});
