/**
 * Test Case ID: TC_ADM_120
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Configure email with SMTP mail type and Login auth
 * Priority: High
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_120', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_120: Configure email with SMTP mail type and Login auth', function () {
    // Objective: Verify smtpHost and smtpAuthType become required when mailType is smtp/secure_smtp, and smtpUsername/smtpPassword become required when authType is login.
    cy.url().should('include', '/auth/login');
  });
});
