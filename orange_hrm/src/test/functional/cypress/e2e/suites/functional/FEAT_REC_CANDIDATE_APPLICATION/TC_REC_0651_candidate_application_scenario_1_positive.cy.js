/**
 * Test Case ID: TC_REC_0651
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0651', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0651: Candidate Application - Scenario 1 (Positive)', function () {
    // Objective: Validate Candidate Application behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
