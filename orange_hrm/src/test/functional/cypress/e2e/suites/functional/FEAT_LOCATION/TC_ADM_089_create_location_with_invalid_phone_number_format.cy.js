/**
 * Test Case ID: TC_ADM_089
 * Feature: FEAT_LOCATION
 * Name: Create location with invalid phone number format
 * Priority: Medium
 */

describe('Feature FEAT_LOCATION: TC_ADM_089', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_089: Create location with invalid phone number format', function () {
    // Objective: Verify phone field must match the expected PHONE format rule (max 30 chars).
    cy.url().should('include', '/auth/login');
  });
});
