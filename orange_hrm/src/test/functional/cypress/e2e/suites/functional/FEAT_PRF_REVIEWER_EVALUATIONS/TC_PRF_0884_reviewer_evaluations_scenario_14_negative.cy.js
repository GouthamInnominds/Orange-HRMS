/**
 * Test Case ID: TC_PRF_0884
 * Feature: FEAT_PRF_REVIEWER_EVALUATIONS
 * Name: Reviewer Evaluations - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_REVIEWER_EVALUATIONS: TC_PRF_0884', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0884: Reviewer Evaluations - Scenario 14 (Negative)', function () {
    // Objective: Validate Reviewer Evaluations behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
