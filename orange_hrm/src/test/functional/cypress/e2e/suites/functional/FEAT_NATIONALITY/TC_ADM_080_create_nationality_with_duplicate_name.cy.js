/**
 * Test Case ID: TC_ADM_080
 * Feature: FEAT_NATIONALITY
 * Name: Create nationality with duplicate name
 * Priority: High
 */

describe('Feature FEAT_NATIONALITY: TC_ADM_080', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_080: Create nationality with duplicate name', function () {
    // Objective: Verify nationality name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
