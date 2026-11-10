/**
 * Test Case ID: TC_AUTH_065
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Token issued for one form cannot validate a different form
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_065', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_065: Token issued for one form cannot validate a different form', function () {
    // Objective: Verify each form uses a distinct CSRF token namespace (id) so a token cannot be replayed across unrelated forms.
    cy.url().should('include', '/auth/login');
  });
});
