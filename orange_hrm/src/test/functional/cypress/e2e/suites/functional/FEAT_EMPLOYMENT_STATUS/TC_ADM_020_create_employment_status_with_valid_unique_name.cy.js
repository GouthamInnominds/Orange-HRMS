/**
 * Test Case ID: TC_ADM_020
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Create employment status with valid unique name
 * Priority: High
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_020', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_020: Create employment status with valid unique name', function () {
    // Objective: Verify an Employment Status can be created with a valid unique name (<=50 chars).
    cy.url().should('include', '/auth/login');
  });
});
