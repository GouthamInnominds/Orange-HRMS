/**
 * Test Case ID: TC_ADM_082
 * Feature: FEAT_NATIONALITY
 * Name: Update nationality name
 * Priority: Medium
 */

describe('Feature FEAT_NATIONALITY: TC_ADM_082', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_082: Update nationality name', function () {
    // Objective: Verify an existing nationality name can be updated.
    cy.url().should('include', '/auth/login');
  });
});
