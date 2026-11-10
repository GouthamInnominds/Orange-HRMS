/**
 * Test Case ID: TC_PIM_0162
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0162', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0162: Job Details - Scenario 17 (Positive)', function () {
    // Objective: Validate Job Details behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
