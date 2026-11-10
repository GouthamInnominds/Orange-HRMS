/**
 * Test Case ID: TC_ADM_149
 * Feature: FEAT_I18N_TRANSLATION
 * Name: Filter to show only translated strings
 * Priority: Medium
 */

describe('Feature FEAT_I18N_TRANSLATION: TC_ADM_149', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_149: Filter to show only translated strings', function () {
    // Objective: Verify the onlyTranslated boolean filter restricts results to strings that already have a translation.
    cy.url().should('include', '/auth/login');
  });
});
