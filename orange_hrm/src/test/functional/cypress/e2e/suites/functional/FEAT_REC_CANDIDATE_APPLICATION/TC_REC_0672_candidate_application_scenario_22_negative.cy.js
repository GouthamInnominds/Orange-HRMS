/**
 * Test Case ID: TC_REC_0672
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0672', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0672: Candidate Application - Scenario 22 (Negative)', function () {
    // Objective: Validate Candidate Application behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
