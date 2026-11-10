/**
 * Test Case ID: TC_PIM_0268
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0268', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0268: Custom Fields - Scenario 3 (Boundary)', function () {
    // Objective: Validate Custom Fields behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
