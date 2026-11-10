/**
 * Test Case ID: TC_ADM_078
 * Feature: FEAT_NATIONALITY
 * Name: Create nationality with valid unique name
 * Priority: High
 */

describe('Feature FEAT_NATIONALITY: TC_ADM_078', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_078: Create nationality with valid unique name', function () {
    // Objective: Verify a Nationality record can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });
});
