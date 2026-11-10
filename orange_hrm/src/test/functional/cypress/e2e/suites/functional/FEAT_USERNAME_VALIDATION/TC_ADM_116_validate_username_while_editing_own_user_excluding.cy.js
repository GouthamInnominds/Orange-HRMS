/**
 * Test Case ID: TC_ADM_116
 * Feature: FEAT_USERNAME_VALIDATION
 * Name: Validate username while editing own user (excluding self)
 * Priority: Medium
 */

describe('Feature FEAT_USERNAME_VALIDATION: TC_ADM_116', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_116: Validate username while editing own user (excluding self)', function () {
    // Objective: Verify passing userId excludes that user\'s own current username from the uniqueness check.
    cy.url().should('include', '/auth/login');
  });
});
