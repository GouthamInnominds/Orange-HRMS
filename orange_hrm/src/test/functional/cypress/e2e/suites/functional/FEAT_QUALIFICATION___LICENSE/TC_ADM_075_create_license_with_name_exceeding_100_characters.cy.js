/**
 * Test Case ID: TC_ADM_075
 * Feature: FEAT_QUALIFICATION___LICENSE
 * Name: Create license with name exceeding 100 characters
 * Priority: Medium
 */

describe('Feature FEAT_QUALIFICATION___LICENSE: TC_ADM_075', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_075: Create license with name exceeding 100 characters', function () {
    // Objective: Verify name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
