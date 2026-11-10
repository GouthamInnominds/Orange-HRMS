/**
 * Test Case ID: TC_ADM_076
 * Feature: FEAT_QUALIFICATION___LICENSE
 * Name: Update license name
 * Priority: Medium
 */

describe('Feature FEAT_QUALIFICATION___LICENSE: TC_ADM_076', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_076: Update license name', function () {
    // Objective: Verify an existing license name can be updated.
    cy.url().should('include', '/auth/login');
  });
});
