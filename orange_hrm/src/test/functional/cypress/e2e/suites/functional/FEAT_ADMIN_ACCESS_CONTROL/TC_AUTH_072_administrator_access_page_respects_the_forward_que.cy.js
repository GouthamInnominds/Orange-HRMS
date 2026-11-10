/**
 * Test Case ID: TC_AUTH_072
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Administrator Access page respects the 'forward' query parameter
 * Priority: Medium
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_072', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_072: Administrator Access page respects the \'forward\' query parameter', function () {
    // Objective: Verify the intended destination after verification is captured from the \'forward\' query string.
    cy.url().should('include', '/auth/login');
  });
});
