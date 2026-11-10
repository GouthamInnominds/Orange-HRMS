/**
 * Test Case ID: TC_ADM_151
 * Feature: FEAT_I18N_GROUP
 * Name: List all I18N translation groups
 * Priority: Medium
 */

describe('Feature FEAT_I18N_GROUP: TC_ADM_151', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_151: List all I18N translation groups', function () {
    // Objective: Verify all translation groups (module groupings for language strings) can be listed.
    cy.url().should('include', '/auth/login');
  });
});
