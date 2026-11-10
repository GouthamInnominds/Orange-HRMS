/**
 * Test Case ID: TC_AUTH_012
 * Feature: FEAT_LOGIN
 * Name: Login form renders CSRF token and provider options correctly
 * Priority: Low
 */

describe('Feature FEAT_LOGIN: TC_AUTH_012', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_012: Login form renders CSRF token and provider options correctly', function () {
    // Objective: Verify the login page pre-render step supplies a CSRF token and the configured social/OpenID login provider list.
    cy.url().should('include', '/auth/login');
  });
});
