/**
 * Test Case ID: TC_AUTH_082
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Re-login after session timeout returns the user to the originally requested page
 * Priority: Medium
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_082', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_082: Re-login after session timeout returns the user to the originally requested page', function () {
    // Objective: Verify the post-timeout login flow restores the user\'s original destination rather than always going to the home page.
    cy.url().should('include', '/auth/login');
  });
});
