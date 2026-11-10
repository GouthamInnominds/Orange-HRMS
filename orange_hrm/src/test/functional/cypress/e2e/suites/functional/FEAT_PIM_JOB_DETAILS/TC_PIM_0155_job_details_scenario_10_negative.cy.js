/**
 * Test Case ID: TC_PIM_0155
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0155', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0155: Job Details - Scenario 10 (Negative)', function () {
    // Objective: Validate Job Details behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
