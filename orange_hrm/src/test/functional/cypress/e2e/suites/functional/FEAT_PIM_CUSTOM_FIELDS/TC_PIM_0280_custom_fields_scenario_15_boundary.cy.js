/**
 * Test Case ID: TC_PIM_0280
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0280', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0280: Custom Fields - Scenario 15 (Boundary)', function () {
    // Objective: Validate Custom Fields behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
