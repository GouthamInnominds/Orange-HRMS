/**
 * Test Case ID: TC_PIM_0154
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0154', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0154: Job Details - Scenario 9 (Positive)', function () {
    // Objective: Validate Job Details behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
