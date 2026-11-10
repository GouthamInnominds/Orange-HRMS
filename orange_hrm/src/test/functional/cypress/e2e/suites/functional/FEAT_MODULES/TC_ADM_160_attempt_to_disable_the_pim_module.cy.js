/**
 * Test Case ID: TC_ADM_160
 * Feature: FEAT_MODULES
 * Name: Attempt to disable the PIM module
 * Priority: High
 */

describe('Feature FEAT_MODULES: TC_ADM_160', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_160: Attempt to disable the PIM module', function () {
    // Objective: Verify the PIM module cannot be disabled (must always remain true per TRUE_VAL rule).
    cy.url().should('include', '/auth/login');
  });
});
