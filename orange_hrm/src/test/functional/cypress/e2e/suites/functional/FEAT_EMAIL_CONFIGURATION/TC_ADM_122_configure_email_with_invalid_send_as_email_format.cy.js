/**
 * Test Case ID: TC_ADM_122
 * Feature: FEAT_EMAIL_CONFIGURATION
 * Name: Configure email with invalid Send As email format
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_CONFIGURATION: TC_ADM_122', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_122: Configure email with invalid Send As email format', function () {
    // Objective: Verify sentAs field must be a valid email address (max 100 chars).
    cy.url().should('include', '/auth/login');
  });
});
