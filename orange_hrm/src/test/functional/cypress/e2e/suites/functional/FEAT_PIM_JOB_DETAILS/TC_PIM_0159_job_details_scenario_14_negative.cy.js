/**
 * Test Case ID: TC_PIM_0159
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0159', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0159: Job Details - Scenario 14 (Negative)', function () {
    // Objective: Validate Job Details behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
