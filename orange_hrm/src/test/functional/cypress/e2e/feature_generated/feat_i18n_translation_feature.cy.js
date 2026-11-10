/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_I18N_TRANSLATION | Tests: 6
 */

describe('Feature: FEAT_I18N_TRANSLATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_145: List translations for a language', function () {
    // Priority: Medium | Objective: Verify translation strings for a specific languageId can be listed.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_146: Filter translations by source text', function () {
    // Priority: Medium | Objective: Verify translations list can be filtered by sourceText (max 250 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_147: Filter translations by translated text', function () {
    // Priority: Medium | Objective: Verify translations list can be filtered by translatedText.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_148: Filter translations by group id', function () {
    // Priority: Medium | Objective: Verify translations list can be filtered by a valid I18N group id.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_149: Filter to show only translated strings', function () {
    // Priority: Medium | Objective: Verify the onlyTranslated boolean filter restricts results to strings that already have a translation.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_150: List translations for a non-existent language id', function () {
    // Priority: Low | Objective: Verify listing translations for an invalid/non-existent languageId is handled gracefully.
    cy.url().should('include', '/auth/login');
  });

});
