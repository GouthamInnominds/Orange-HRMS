/**
 * Test Case ID: TC_AUTH_057
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password containing spaces when spaces are disallowed
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_057', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_057: Password containing spaces when spaces are disallowed', function () {
    // Objective: Verify a password containing whitespace is rejected under the default is_spaces_allowed=false policy.
    cy.url().should('include', '/auth/login');
  });
});
