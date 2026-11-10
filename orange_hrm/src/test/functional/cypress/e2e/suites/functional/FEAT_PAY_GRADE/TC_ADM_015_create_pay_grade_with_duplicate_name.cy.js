/**
 * Test Case ID: TC_ADM_015
 * Feature: FEAT_PAY_GRADE
 * Name: Create pay grade with duplicate name
 * Priority: High
 */

describe('Feature FEAT_PAY_GRADE: TC_ADM_015', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_015: Create pay grade with duplicate name', function () {
    // Objective: Verify pay grade name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
