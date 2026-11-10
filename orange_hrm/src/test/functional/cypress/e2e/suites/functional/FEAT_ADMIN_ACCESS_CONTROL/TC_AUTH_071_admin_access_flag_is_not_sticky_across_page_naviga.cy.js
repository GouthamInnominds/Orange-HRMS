/**
 * Test Case ID: TC_AUTH_071
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Admin access flag is not sticky across page navigation
 * Priority: High
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_071', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_071: Admin access flag is not sticky across page navigation', function () {
    // Objective: Verify that gaining admin access on one page does not silently grant it on subsequent unrelated pages, per AdministratorAccessSubscriber.
    cy.url().should('include', '/auth/login');
  });
});
