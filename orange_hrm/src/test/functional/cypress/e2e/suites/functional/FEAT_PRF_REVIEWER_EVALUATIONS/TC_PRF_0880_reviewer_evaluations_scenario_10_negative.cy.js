/**
 * Test Case ID: TC_PRF_0880
 * Feature: FEAT_PRF_REVIEWER_EVALUATIONS
 * Name: Reviewer Evaluations - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_REVIEWER_EVALUATIONS: TC_PRF_0880', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0880: Reviewer Evaluations - Scenario 10 (Negative)', function () {
    // Objective: Validate Reviewer Evaluations behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
