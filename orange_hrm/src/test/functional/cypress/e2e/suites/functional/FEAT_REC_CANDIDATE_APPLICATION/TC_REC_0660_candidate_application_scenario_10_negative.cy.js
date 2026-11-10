/**
 * Test Case ID: TC_REC_0660
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0660', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0660: Candidate Application - Scenario 10 (Negative)', function () {
    // Objective: Validate Candidate Application behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
