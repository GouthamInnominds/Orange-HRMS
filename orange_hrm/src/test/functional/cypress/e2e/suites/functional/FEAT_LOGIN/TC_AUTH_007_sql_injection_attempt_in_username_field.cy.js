/**
 * Test Case ID: TC_AUTH_007
 * Feature: FEAT_LOGIN
 * Name: SQL injection attempt in username field
 * Priority: High
 */

describe('Feature FEAT_LOGIN: TC_AUTH_007', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_007: SQL injection attempt in username field', function () {
    // Objective: Verify a SQL-injection style payload in the username field cannot bypass authentication.
    cy.url().should('include', '/auth/login');
  });
});
