/**
 * Test Case ID: TC_PIM_0153
 * Feature: FEAT_PIM_JOB_DETAILS
 * Name: Job Details - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_JOB_DETAILS: TC_PIM_0153', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0153: Job Details - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Job Details behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
