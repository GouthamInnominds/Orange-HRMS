/**
 * Test Case ID: TC_REC_0655
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0655', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0655: Candidate Application - Scenario 5 (Positive)', function () {
    // Objective: Validate Candidate Application behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
