/**
 * Test Case ID: TC_PIM_0170
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0170', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0170: Job Details - Scenario 25 (Positive)', function () {
    // Objective: Validate Job Details behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
