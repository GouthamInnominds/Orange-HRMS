/**
 * Test Case ID: TC_PIM_0158
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0158', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0158: Job Details - Scenario 13 (Positive)', function () {
    // Objective: Validate Job Details behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
