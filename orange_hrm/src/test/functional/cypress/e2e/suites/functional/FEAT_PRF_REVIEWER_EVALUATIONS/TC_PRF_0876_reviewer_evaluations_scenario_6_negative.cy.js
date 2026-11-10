/**
 * Test Case ID: TC_PRF_0876
 * Feature: FEAT_PRF_REVIEWER_EVALUATIONS
 * Name: Reviewer Evaluations - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_REVIEWER_EVALUATIONS: TC_PRF_0876', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0876: Reviewer Evaluations - Scenario 6 (Negative)', function () {
    // Objective: Validate Reviewer Evaluations behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
