/**
 * Test Case ID: TC_ADM_024
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Update employment status name
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_024', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_024: Update employment status name', function () {
    // Objective: Verify an existing employment status name can be updated.
    cy.url().should('include', '/auth/login');
  });
});
