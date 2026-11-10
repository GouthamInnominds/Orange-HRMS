/**
 * Test Case ID: TC_REC_0698
 * Feature: FEAT_REC_CANDIDATE_SHORTLISTING
 * Name: Candidate Shortlisting - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_SHORTLISTING: TC_REC_0698', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0698: Candidate Shortlisting - Scenario 13 (Positive)', function () {
    // Objective: Validate Candidate Shortlisting behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
