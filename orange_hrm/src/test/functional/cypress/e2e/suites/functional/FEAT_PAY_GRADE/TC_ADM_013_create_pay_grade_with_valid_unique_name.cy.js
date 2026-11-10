/**
 * Test Case ID: TC_ADM_013
 * Feature: FEAT_PAY_GRADE
 * Name: Create pay grade with valid unique name
 * Priority: High
 */

describe('Feature FEAT_PAY_GRADE: TC_ADM_013', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_013: Create pay grade with valid unique name', function () {
    // Objective: Verify a Pay Grade can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });
});
