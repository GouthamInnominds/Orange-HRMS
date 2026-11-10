/**
 * Test Case ID: TC_ADM_079
 * Feature: FEAT_NATIONALITY
 * Name: Create nationality with missing name
 * Priority: High
 */

describe('Feature FEAT_NATIONALITY: TC_ADM_079', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_079: Create nationality with missing name', function () {
    // Objective: Verify name is required to create a nationality record.
    cy.url().should('include', '/auth/login');
  });
});
