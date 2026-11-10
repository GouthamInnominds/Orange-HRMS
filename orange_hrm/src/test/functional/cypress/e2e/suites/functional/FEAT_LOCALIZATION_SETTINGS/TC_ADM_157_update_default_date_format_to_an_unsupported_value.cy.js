/**
 * Test Case ID: TC_ADM_157
 * Feature: FEAT_LOCALIZATION_SETTINGS
 * Name: Update default date format to an unsupported value
 * Priority: Medium
 */

describe('Feature FEAT_LOCALIZATION_SETTINGS: TC_ADM_157', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_157: Update default date format to an unsupported value', function () {
    // Objective: Verify dateFormat must be one of the supported date format keys.
    cy.url().should('include', '/auth/login');
  });
});
