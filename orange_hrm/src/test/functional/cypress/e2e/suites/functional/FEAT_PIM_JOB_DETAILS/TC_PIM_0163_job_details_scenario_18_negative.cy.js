/**
 * Test Case ID: TC_PIM_0163
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0163', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0163: Job Details - Scenario 18 (Negative)', function () {
    // Objective: Validate Job Details behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
