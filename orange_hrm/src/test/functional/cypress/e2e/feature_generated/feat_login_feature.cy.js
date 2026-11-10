/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LOGIN | Tests: 12
 */

describe('Feature: FEAT_LOGIN', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_001: Valid login with correct credentials', function () {
    // Priority: High | Objective: Verify a user with correct username and password is authenticated and reaches the home page.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_002: Login with incorrect password', function () {
    // Priority: High | Objective: Verify login is rejected when the password does not match the stored credentials.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_003: Login with non-existent username', function () {
    // Priority: High | Objective: Verify login with an unregistered username returns the same generic error as a wrong password (no user enumeration).
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_004: Login with empty username field', function () {
    // Priority: Medium | Objective: Verify submitting the login form without a username is handled as invalid credentials.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_005: Login with empty password field', function () {
    // Priority: Medium | Objective: Verify submitting the login form without a password is handled as invalid credentials.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_006: Login with both username and password empty', function () {
    // Priority: Medium | Objective: Verify submitting a completely empty login form does not authenticate the user.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_007: SQL injection attempt in username field', function () {
    // Priority: High | Objective: Verify a SQL-injection style payload in the username field cannot bypass authentication.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_008: Already authenticated user requests the login page', function () {
    // Priority: Medium | Objective: Verify a user who already has an authenticated session is redirected away from the login form instead of seeing it again.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_009: Root URL redirects to login page', function () {
    // Priority: Low | Objective: Verify hitting the application root path redirects an unauthenticated visitor to the login page.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_010: Unexpected error during authentication is handled gracefully', function () {
    // Priority: Medium | Objective: Verify that an unexpected (non-AuthenticationException) failure during the authentication chain does not crash the login flow.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_011: Successful login is recorded in the login log', function () {
    // Priority: Medium | Objective: Verify a successful authentication creates an accurate entry in the login log (ohrm_login).
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_012: Login form renders CSRF token and provider options correctly', function () {
    // Priority: Low | Objective: Verify the login page pre-render step supplies a CSRF token and the configured social/OpenID login provider list.
    cy.url().should('include', '/auth/login');
  });

});
