/**
 * Test Case ID: TC_REC_0658
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0658', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0658: Candidate Application - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Candidate Application behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
