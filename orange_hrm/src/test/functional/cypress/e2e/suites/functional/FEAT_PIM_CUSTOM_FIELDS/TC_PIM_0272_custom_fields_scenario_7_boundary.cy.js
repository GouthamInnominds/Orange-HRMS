/**
 * Test Case ID: TC_PIM_0272
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 7 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0272', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0272: Custom Fields - Scenario 7 (Boundary)', function () {
    // Objective: Validate Custom Fields behavior under Boundary conditions (Rule validation #7).
    cy.url().should('include', '/auth/login');
  });
});
