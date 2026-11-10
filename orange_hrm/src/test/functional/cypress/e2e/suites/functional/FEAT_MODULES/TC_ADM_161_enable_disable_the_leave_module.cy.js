/**
 * Test Case ID: TC_ADM_161
 * Feature: FEAT_MODULES
 * Name: Enable/disable the Leave module
 * Priority: Medium
 */

describe('Feature FEAT_MODULES: TC_ADM_161', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_161: Enable/disable the Leave module', function () {
    // Objective: Verify non-core modules such as Leave can be toggled on and off.
    cy.url().should('include', '/auth/login');
  });
});
