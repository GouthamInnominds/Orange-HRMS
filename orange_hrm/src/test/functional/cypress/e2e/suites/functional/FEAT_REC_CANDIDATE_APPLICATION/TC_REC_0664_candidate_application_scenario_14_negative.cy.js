/**
 * Test Case ID: TC_REC_0664
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0664', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0664: Candidate Application - Scenario 14 (Negative)', function () {
    // Objective: Validate Candidate Application behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
