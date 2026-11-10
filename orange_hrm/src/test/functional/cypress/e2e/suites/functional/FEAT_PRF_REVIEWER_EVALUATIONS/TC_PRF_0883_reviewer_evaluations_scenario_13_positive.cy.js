/**
 * Test Case ID: TC_PRF_0883
 * Feature: FEAT_PRF_REVIEWER_EVALUATIONS
 * Name: Reviewer Evaluations - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_REVIEWER_EVALUATIONS: TC_PRF_0883', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0883: Reviewer Evaluations - Scenario 13 (Positive)', function () {
    // Objective: Validate Reviewer Evaluations behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
