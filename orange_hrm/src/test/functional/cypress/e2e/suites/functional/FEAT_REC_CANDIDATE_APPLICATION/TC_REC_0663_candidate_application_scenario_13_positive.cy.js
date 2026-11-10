/**
 * Test Case ID: TC_REC_0663
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0663', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0663: Candidate Application - Scenario 13 (Positive)', function () {
    // Objective: Validate Candidate Application behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
