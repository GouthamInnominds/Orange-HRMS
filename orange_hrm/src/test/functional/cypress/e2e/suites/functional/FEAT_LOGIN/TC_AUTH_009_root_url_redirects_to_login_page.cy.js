/**
 * Test Case ID: TC_AUTH_009
 * Feature: FEAT_LOGIN
 * Name: Root URL redirects to login page
 * Priority: Low
 */

describe('Feature FEAT_LOGIN: TC_AUTH_009', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_009: Root URL redirects to login page', function () {
    // Objective: Verify hitting the application root path redirects an unauthenticated visitor to the login page.
    cy.url().should('include', '/auth/login');
  });
});
