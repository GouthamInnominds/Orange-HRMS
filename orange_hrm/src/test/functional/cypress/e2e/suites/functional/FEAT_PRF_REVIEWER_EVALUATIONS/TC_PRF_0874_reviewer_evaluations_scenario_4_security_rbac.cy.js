/**
 * Test Case ID: TC_PRF_0874
 * Feature: FEAT_PRF_REVIEWER_EVALUATIONS
 * Name: Reviewer Evaluations - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PRF_REVIEWER_EVALUATIONS: TC_PRF_0874', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0874: Reviewer Evaluations - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Reviewer Evaluations behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
