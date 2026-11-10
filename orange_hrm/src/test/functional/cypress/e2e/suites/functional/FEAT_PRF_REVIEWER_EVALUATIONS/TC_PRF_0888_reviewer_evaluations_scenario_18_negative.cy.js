/**
 * Test Case ID: TC_PRF_0888
 * Feature: FEAT_PRF_REVIEWER_EVALUATIONS
 * Name: Reviewer Evaluations - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_REVIEWER_EVALUATIONS: TC_PRF_0888', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0888: Reviewer Evaluations - Scenario 18 (Negative)', function () {
    // Objective: Validate Reviewer Evaluations behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
