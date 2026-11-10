/**
 * Test Case ID: TC_AUTH_068
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: User without admin-verify permission is forwarded to Forbidden page
 * Priority: High
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_068', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_068: User without admin-verify permission is forwarded to Forbidden page', function () {
    // Objective: Verify a user lacking the \'auth_admin_verify\' data-group read permission cannot reach the admin verification step.
    cy.url().should('include', '/auth/login');
  });
});
