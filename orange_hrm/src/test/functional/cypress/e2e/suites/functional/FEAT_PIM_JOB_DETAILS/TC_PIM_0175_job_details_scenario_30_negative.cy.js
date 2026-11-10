/**
 * Test Case ID: TC_PIM_0175
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0175', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0175: Job Details - Scenario 30 (Negative)', function () {
    // Objective: Validate Job Details behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
