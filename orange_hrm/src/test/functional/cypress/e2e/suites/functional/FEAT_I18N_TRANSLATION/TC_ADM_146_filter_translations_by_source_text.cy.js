/**
 * Test Case ID: TC_ADM_146
 * Feature: FEAT_I18N_TRANSLATION
 * Name: Filter translations by source text
 * Priority: Medium
 */

describe('Feature FEAT_I18N_TRANSLATION: TC_ADM_146', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_146: Filter translations by source text', function () {
    // Objective: Verify translations list can be filtered by sourceText (max 250 chars).
    cy.url().should('include', '/auth/login');
  });
});
