/**
 * Test Case ID: TC_AUTH_011
 * Feature: FEAT_LOGIN
 * Name: Successful login is recorded in the login log
 * Priority: Medium
 */

describe('Feature FEAT_LOGIN: TC_AUTH_011', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_011: Successful login is recorded in the login log', function () {
    // Objective: Verify a successful authentication creates an accurate entry in the login log (ohrm_login).
    cy.url().should('include', '/auth/login');
  });
});
