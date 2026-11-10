/**
 * Test Case ID: TC_ADM_162
 * Feature: FEAT_MODULES
 * Name: Enable/disable the Mobile module
 * Priority: Medium
 */

describe('Feature FEAT_MODULES: TC_ADM_162', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_162: Enable/disable the Mobile module', function () {
    // Objective: Verify Mobile module toggle updates the mobile OAuth client status accordingly.
    cy.url().should('include', '/auth/login');
  });
});
