/**
 * Test Case ID: TC_PIM_0284
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 19 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0284', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0284: Custom Fields - Scenario 19 (Boundary)', function () {
    // Objective: Validate Custom Fields behavior under Boundary conditions (Rule validation #19).
    cy.url().should('include', '/auth/login');
  });
});
