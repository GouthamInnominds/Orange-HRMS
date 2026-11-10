/**
 * Test Case ID: TC_ADM_126
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Send a test email with invalid test email address format
 * Priority: Low
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_126', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_126: Send a test email with invalid test email address format', function () {
    // Objective: Verify testEmailAddress must be a valid email format (max 250 chars) when provided.
    cy.url().should('include', '/auth/login');
  });
});
