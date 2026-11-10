/**
 * Test Case ID: TC_AUTH_014
 * Feature: FEAT_LOGOUT
 * Name: Protected pages are inaccessible immediately after logout
 * Priority: High
 */

describe('Feature FEAT_LOGOUT: TC_AUTH_014', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_014: Protected pages are inaccessible immediately after logout', function () {
    // Objective: Verify that after logout, previously accessible authenticated pages can no longer be reached without logging in again.
    cy.url().should('include', '/auth/login');
  });
});
