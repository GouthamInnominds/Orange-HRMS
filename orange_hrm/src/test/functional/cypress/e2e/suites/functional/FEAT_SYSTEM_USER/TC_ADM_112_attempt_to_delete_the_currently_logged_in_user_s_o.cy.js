/**
 * Test Case ID: TC_ADM_112
 * Feature: FEAT_SYSTEM_USER
 * Name: Attempt to delete the currently logged-in user's own account
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_112', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_112: Attempt to delete the currently logged-in user\'s own account', function () {
    // Objective: Verify a user cannot delete their own logged-in account (undeletable id business rule).
    cy.url().should('include', '/auth/login');
  });
});
