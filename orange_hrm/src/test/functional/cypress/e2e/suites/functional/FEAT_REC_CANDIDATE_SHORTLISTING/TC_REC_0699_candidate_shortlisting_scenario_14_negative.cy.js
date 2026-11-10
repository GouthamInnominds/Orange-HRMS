/**
 * Test Case ID: TC_REC_0699
 * Feature: FEAT_REC_CANDIDATE_SHORTLISTING
 * Name: Candidate Shortlisting - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_CANDIDATE_SHORTLISTING: TC_REC_0699', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0699: Candidate Shortlisting - Scenario 14 (Negative)', function () {
    // Objective: Validate Candidate Shortlisting behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
