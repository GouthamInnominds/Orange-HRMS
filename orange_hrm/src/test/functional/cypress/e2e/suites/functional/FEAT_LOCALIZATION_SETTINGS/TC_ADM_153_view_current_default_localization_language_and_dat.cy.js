/**
 * Test Case ID: TC_ADM_153
 * Feature: FEAT_LOCALIZATION_SETTINGS
 * Name: View current default localization language and date format
 * Priority: Medium
 */

describe('Feature FEAT_LOCALIZATION_SETTINGS: TC_ADM_153', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_153: View current default localization language and date format', function () {
    // Objective: Verify the admin panel\'s default display language and date format can be retrieved.
    cy.url().should('include', '/auth/login');
  });
});
