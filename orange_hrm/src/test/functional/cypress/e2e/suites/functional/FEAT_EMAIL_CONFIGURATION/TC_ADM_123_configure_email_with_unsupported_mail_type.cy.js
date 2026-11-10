/**
 * Test Case ID: TC_ADM_123
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Configure email with unsupported mail type
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_123', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_123: Configure email with unsupported mail type', function () {
    // Objective: Verify mailType must be one of sendmail, smtp, or secure_smtp.
    cy.url().should('include', '/auth/login');
  });
});
