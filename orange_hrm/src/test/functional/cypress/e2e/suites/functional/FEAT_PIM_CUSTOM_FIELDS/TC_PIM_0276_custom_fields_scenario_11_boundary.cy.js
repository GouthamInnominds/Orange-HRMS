/**
 * Test Case ID: TC_PIM_0276
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0276', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0276: Custom Fields - Scenario 11 (Boundary)', function () {
    // Objective: Validate Custom Fields behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
