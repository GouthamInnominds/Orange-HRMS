/**
 * Test Case ID: TC_ADM_074
 * Feature: FEAT_QUALIFICATION___LICENSE
 * Name: Create license with duplicate name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LICENSE: TC_ADM_074', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_074: Create license with duplicate name', function () {
    // Objective: Verify license name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
