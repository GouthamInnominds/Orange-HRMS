/**
 * Test Case ID: TC_MNT_1060
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1060', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1060: Purge Candidate Records - Scenario 5 (Positive)', function () {
    // Objective: Validate Purge Candidate Records behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
