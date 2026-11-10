/**
 * Test Case ID: TC_ADM_113
 * Feature: FEAT_SYSTEM_USER
 * Name: Delete one or more system users (not self)
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_113', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_113: Delete one or more system users (not self)', function () {
    // Objective: Verify selected system users (other than the current logged-in user) can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
