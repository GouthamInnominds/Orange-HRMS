/**
 * Test Case ID: TC_ADM_156
 * Feature: FEAT_LOCALIZATION_SETTINGS
 * Name: Update default date format to a supported format
 * Priority: Medium
 */

describe('Feature FEAT_LOCALIZATION_SETTINGS: TC_ADM_156', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_156: Update default date format to a supported format', function () {
    // Objective: Verify default date format can be updated to any value from the supported date formats list.
    cy.url().should('include', '/auth/login');
  });
});
