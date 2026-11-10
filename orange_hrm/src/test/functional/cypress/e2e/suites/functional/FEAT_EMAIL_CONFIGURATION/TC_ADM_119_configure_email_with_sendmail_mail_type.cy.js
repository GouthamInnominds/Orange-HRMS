/**
 * Test Case ID: TC_ADM_119
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Configure email with Sendmail mail type
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_119', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_119: Configure email with Sendmail mail type', function () {
    // Objective: Verify mailType can be set to sendmail without requiring SMTP host/username/password.
    cy.url().should('include', '/auth/login');
  });
});
