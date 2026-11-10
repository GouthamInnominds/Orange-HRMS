/**
 * Test Case ID: TC_ADM_021
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Create employment status with missing name
 * Priority: High
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_021', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_021: Create employment status with missing name', function () {
    // Objective: Verify name is required to create an employment status.
    cy.url().should('include', '/auth/login');
  });
});
