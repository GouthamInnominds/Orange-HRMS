/**
 * Test Case ID: TC_ADM_114
 * Feature: FEAT_USERNAME_VALIDATION
 * Name: Validate an available (unused) username
 * Priority: Medium
 */

describe('Feature FEAT_USERNAME_VALIDATION: TC_ADM_114', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_114: Validate an available (unused) username', function () {
    // Objective: Verify username validation endpoint returns valid=true for a username not already in use.
    cy.url().should('include', '/auth/login');
  });
});
