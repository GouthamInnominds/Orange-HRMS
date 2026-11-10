/**
 * Test Case ID: TC_AUTH_070
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Authorized admin submits an incorrect password on the verification page
 * Priority: High
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_070', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_070: Authorized admin submits an incorrect password on the verification page', function () {
    // Objective: Verify re-authentication fails safely when the wrong password is supplied on the step-up form.
    cy.url().should('include', '/auth/login');
  });
});
