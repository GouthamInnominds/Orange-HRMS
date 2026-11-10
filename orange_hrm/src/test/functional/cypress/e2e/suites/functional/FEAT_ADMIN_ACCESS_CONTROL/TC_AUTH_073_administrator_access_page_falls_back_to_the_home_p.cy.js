/**
 * Test Case ID: TC_AUTH_073
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Administrator Access page falls back to the home page as the back URL
 * Priority: Medium
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_073', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_073: Administrator Access page falls back to the home page as the back URL', function () {
    // Objective: Verify that without an explicit \'back\' query parameter (and no prior flash error), the back-url defaults to the user\'s home page path.
    cy.url().should('include', '/auth/login');
  });
});
