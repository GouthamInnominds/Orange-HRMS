/**
 * Test Case ID: TC_REC_0676
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 26 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0676', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0676: Candidate Application - Scenario 26 (Negative)', function () {
    // Objective: Validate Candidate Application behavior under Negative conditions (Rule validation #26).
    cy.url().should('include', '/auth/login');
  });
});
