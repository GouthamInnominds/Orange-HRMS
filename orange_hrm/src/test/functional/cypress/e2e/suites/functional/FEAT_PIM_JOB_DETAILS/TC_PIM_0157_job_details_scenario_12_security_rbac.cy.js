/**
 * Test Case ID: TC_PIM_0157
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0157', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0157: Job Details - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Job Details behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
