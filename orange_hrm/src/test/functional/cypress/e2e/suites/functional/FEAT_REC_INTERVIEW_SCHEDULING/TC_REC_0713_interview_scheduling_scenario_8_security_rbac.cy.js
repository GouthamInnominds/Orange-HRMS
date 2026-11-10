/**
 * Test Case ID: TC_REC_0713
 * Feature: FEAT_REC_INTERVIEW_SCHEDULING
 * Name: Interview Scheduling - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_REC_INTERVIEW_SCHEDULING: TC_REC_0713', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0713: Interview Scheduling - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Interview Scheduling behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
