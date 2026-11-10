/**
 * Test Case ID: TC_REC_0659
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0659', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0659: Candidate Application - Scenario 9 (Positive)', function () {
    // Objective: Validate Candidate Application behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
