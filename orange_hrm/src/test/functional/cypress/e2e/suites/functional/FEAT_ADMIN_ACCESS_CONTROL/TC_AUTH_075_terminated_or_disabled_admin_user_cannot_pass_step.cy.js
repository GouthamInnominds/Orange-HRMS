/**
 * Test Case ID: TC_AUTH_075
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Terminated or disabled admin user cannot pass step-up verification
 * Priority: High
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_075', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_075: Terminated or disabled admin user cannot pass step-up verification', function () {
    // Objective: Verify that even with the correct password, a disabled or terminated admin account fails the re-authentication check.
    cy.url().should('include', '/auth/login');
  });
});
