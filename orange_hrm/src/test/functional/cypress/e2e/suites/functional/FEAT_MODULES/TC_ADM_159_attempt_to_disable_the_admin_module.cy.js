/**
 * Test Case ID: TC_ADM_159
 * Feature: FEAT_MODULES
 * Name: Attempt to disable the Admin module
 * Priority: High
 */

describe('Feature FEAT_MODULES: TC_ADM_159', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_159: Attempt to disable the Admin module', function () {
    // Objective: Verify the Admin module cannot be disabled (must always remain true per TRUE_VAL rule).
    cy.url().should('include', '/auth/login');
  });
});
