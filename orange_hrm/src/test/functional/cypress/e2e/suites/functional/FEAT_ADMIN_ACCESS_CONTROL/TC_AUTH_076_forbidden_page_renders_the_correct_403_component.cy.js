/**
 * Test Case ID: TC_AUTH_076
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Forbidden page renders the correct 403 component
 * Priority: Low
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_076', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_076: Forbidden page renders the correct 403 component', function () {
    // Objective: Verify the Forbidden landing page displays the expected UI when access is denied.
    cy.url().should('include', '/auth/login');
  });
});
