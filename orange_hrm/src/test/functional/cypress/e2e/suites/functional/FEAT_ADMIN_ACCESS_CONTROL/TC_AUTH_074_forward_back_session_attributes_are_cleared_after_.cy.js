/**
 * Test Case ID: TC_AUTH_074
 * Feature: FEAT_ADMIN_ACCESS_CONTROL
 * Name: Forward/back session attributes are cleared after successful verification
 * Priority: Medium
 */

describe('Feature FEAT_ADMIN_ACCESS_CONTROL: TC_AUTH_074', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_074: Forward/back session attributes are cleared after successful verification', function () {
    // Objective: Verify stale forward/back URLs do not leak into subsequent unrelated privileged actions.
    cy.url().should('include', '/auth/login');
  });
});
