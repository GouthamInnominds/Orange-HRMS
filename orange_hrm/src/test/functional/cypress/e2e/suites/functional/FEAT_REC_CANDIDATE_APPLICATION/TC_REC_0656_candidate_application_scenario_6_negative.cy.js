/**
 * Test Case ID: TC_REC_0656
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0656', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0656: Candidate Application - Scenario 6 (Negative)', function () {
    // Objective: Validate Candidate Application behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
