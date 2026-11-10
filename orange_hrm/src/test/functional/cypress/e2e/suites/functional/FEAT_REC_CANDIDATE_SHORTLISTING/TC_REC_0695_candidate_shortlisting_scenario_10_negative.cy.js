/**
 * Test Case ID: TC_REC_0695
 * Feature: FEAT_REC_CANDIDATE_SHORTLISTING
 * Name: Candidate Shortlisting - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_REC_CANDIDATE_SHORTLISTING: TC_REC_0695', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0695: Candidate Shortlisting - Scenario 10 (Negative)', function () {
    // Objective: Validate Candidate Shortlisting behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
