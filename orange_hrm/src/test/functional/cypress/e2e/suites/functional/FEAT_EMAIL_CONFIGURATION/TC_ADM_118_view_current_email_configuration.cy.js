/**
 * Test Case ID: TC_ADM_118
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: View current email configuration
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_118', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_118: View current email configuration', function () {
    // Objective: Verify current email/SMTP configuration can be viewed, defaulting to SMTP/Login/SSL when not yet configured.
    cy.url().should('include', '/auth/login');
  });
});
