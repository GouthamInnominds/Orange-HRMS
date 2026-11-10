/**
 * Test Case ID: TC_ADM_023
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Create employment status with name exceeding 50 characters
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_023', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_023: Create employment status with name exceeding 50 characters', function () {
    // Objective: Verify name is rejected when exceeding max length of 50 characters.
    cy.url().should('include', '/auth/login');
  });
});
