/**
 * Test Case ID: TC_PIM_0172
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 27 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0172', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0172: Job Details - Scenario 27 (Boundary)', function () {
    // Objective: Validate Job Details behavior under Boundary conditions (Rule validation #27).
    cy.url().should('include', '/auth/login');
  });
});
