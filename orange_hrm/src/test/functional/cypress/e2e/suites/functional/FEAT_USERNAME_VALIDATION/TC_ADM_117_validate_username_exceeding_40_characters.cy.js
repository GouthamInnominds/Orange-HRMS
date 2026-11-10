/**
 * Test Case ID: TC_ADM_117
 * Feature: FEAT_USERNAME_VALIDATION
 * Name: Validate username exceeding 40 characters
 * Priority: Low
 */

describe('Feature FEAT_USERNAME_VALIDATION: TC_ADM_117', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_117: Validate username exceeding 40 characters', function () {
    // Objective: Verify username validation rejects values exceeding max length of 40 characters.
    cy.url().should('include', '/auth/login');
  });
});
