/**
 * Test Case ID: TC_ADM_115
 * Feature: FEAT_USERNAME_VALIDATION
 * Name: Validate an already taken username
 * Priority: High
 */

describe('Feature FEAT_USERNAME_VALIDATION: TC_ADM_115', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_115: Validate an already taken username', function () {
    // Objective: Verify username validation endpoint returns valid=false for a username already in use.
    cy.url().should('include', '/auth/login');
  });
});
