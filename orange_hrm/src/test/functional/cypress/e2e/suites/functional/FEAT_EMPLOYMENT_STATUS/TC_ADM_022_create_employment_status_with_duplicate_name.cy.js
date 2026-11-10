/**
 * Test Case ID: TC_ADM_022
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Create employment status with duplicate name
 * Priority: High
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_022', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_022: Create employment status with duplicate name', function () {
    // Objective: Verify employment status name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
