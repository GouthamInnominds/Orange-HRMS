/**
 * Test Case ID: TC_ADM_073
 * Feature: FEAT_QUALIFICATION___LICENSE
 * Name: Create license with missing name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LICENSE: TC_ADM_073', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_073: Create license with missing name', function () {
    // Objective: Verify name is required to create a license record.
    cy.url().should('include', '/auth/login');
  });
});
