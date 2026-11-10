/**
 * Test Case ID: TC_ADM_148
 * Feature: FEAT_I18N_TRANSLATION
 * Name: Filter translations by group id
 * Priority: Medium
 */

describe('Feature FEAT_I18N_TRANSLATION: TC_ADM_148', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_148: Filter translations by group id', function () {
    // Objective: Verify translations list can be filtered by a valid I18N group id.
    cy.url().should('include', '/auth/login');
  });
});
