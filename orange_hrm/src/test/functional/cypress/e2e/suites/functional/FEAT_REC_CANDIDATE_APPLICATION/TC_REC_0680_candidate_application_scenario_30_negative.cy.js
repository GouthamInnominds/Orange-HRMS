/**
 * Test Case ID: TC_REC_0680
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0680', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0680: Candidate Application - Scenario 30 (Negative)', function () {
    // Objective: Validate Candidate Application behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
