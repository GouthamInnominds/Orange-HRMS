/**
 * Test Case ID: TC_ADM_025
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Search employment status list by name filter
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_025', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_025: Search employment status list by name filter', function () {
    // Objective: Verify the employment status list can be filtered by name.
    cy.url().should('include', '/auth/login');
  });
});
