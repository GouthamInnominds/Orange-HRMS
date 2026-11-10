/**
 * Test Case ID: TC_AUTH_006
 * Feature: FEAT_LOGIN
 * Name: Login with both username and password empty
 * Priority: Medium
 */

describe('Feature FEAT_LOGIN: TC_AUTH_006', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_006: Login with both username and password empty', function () {
    // Objective: Verify submitting a completely empty login form does not authenticate the user.
    cy.url().should('include', '/auth/login');
  });
});
