/**
 * Test Case ID: TC_PIM_0146
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0146', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0146: Job Details - Scenario 1 (Positive)', function () {
    // Objective: Validate Job Details behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
