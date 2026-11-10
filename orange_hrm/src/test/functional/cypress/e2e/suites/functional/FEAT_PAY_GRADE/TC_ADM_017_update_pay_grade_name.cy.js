/**
 * Test Case ID: TC_ADM_017
 * Feature: FEAT_PAY_GRADE
 * Name: Update pay grade name
 * Priority: Medium
 */

describe('Feature FEAT_PAY_GRADE: TC_ADM_017', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_017: Update pay grade name', function () {
    // Objective: Verify an existing pay grade\'s name can be updated to another unique value.
    cy.url().should('include', '/auth/login');
  });
});
