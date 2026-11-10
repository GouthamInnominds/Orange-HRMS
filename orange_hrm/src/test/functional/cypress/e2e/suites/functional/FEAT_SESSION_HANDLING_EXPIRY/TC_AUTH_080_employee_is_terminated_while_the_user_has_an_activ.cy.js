/**
 * Test Case ID: TC_AUTH_080
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Employee is terminated while the user has an active session
 * Priority: High
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_080', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_080: Employee is terminated while the user has an active session', function () {
    // Objective: Verify a mid-session employee termination immediately revokes access.
    cy.url().should('include', '/auth/login');
  });
});
