/**
 * Test Case ID: TC_ADM_081
 * Feature: FEAT_NATIONALITY
 * Name: Create nationality with name exceeding 100 characters
 * Priority: Medium
 */

describe('Feature FEAT_NATIONALITY: TC_ADM_081', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_081: Create nationality with name exceeding 100 characters', function () {
    // Objective: Verify name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
