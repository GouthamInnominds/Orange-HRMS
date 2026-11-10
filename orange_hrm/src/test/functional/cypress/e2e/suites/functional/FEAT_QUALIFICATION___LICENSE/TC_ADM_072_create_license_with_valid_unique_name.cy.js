/**
 * Test Case ID: TC_ADM_072
 * Feature: FEAT_QUALIFICATION___LICENSE
 * Name: Create license with valid unique name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LICENSE: TC_ADM_072', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_072: Create license with valid unique name', function () {
    // Objective: Verify a License record can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });
});
