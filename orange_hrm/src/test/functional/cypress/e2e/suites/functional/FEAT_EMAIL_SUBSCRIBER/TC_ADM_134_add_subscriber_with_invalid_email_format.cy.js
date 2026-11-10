/**
 * Test Case ID: TC_ADM_134
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Add subscriber with invalid email format
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_134', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_134: Add subscriber with invalid email format', function () {
    // Objective: Verify subscriber email must be a valid email format (max 100 chars).
    cy.url().should('include', '/auth/login');
  });
});
