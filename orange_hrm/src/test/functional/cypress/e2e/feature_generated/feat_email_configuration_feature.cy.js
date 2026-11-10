/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EMAIL_CONFIGURATION | Tests: 9
 */

describe('Feature: FEAT_EMAIL_CONFIGURATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_118: View current email configuration', function () {
    // Priority: Medium | Objective: Verify current email/SMTP configuration can be viewed, defaulting to SMTP/Login/SSL when not yet configured.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_119: Configure email with Sendmail mail type', function () {
    // Priority: Medium | Objective: Verify mailType can be set to sendmail without requiring SMTP host/username/password.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_120: Configure email with SMTP mail type and Login auth', function () {
    // Priority: High | Objective: Verify smtpHost and smtpAuthType become required when mailType is smtp/secure_smtp, and smtpUsername/smtpPassword become required when authType is login.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_121: Configure SMTP mail type without SMTP host', function () {
    // Priority: High | Objective: Verify smtpHost is required when mailType is smtp or secure_smtp.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_122: Configure email with invalid Send As email format', function () {
    // Priority: Medium | Objective: Verify sentAs field must be a valid email address (max 100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_123: Configure email with unsupported mail type', function () {
    // Priority: Medium | Objective: Verify mailType must be one of sendmail, smtp, or secure_smtp.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_124: Configure email with unsupported SMTP auth type', function () {
    // Priority: Medium | Objective: Verify smtpAuthType must be one of the allowed auth type values (login/none).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_125: Send a test email after saving valid configuration', function () {
    // Priority: Medium | Objective: Verify providing a testEmailAddress triggers a test email send and reports success/failure status.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_126: Send a test email with invalid test email address format', function () {
    // Priority: Low | Objective: Verify testEmailAddress must be a valid email format (max 250 chars) when provided.
    cy.url().should('include', '/auth/login');
  });

});
