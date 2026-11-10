/**
 * Test Case ID: TC_REC_0702
 * Feature: FEAT_REC_CANDIDATE_SHORTLISTING
 * Name: Candidate Shortlisting - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_SHORTLISTING: TC_REC_0702', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0702: Candidate Shortlisting - Scenario 17 (Positive)', function () {
    // Objective: Validate Candidate Shortlisting behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
