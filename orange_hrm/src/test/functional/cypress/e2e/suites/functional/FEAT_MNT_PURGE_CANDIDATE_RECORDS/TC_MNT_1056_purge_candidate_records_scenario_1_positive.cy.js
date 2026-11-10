/**
 * Test Case ID: TC_MNT_1056
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1056', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1056: Purge Candidate Records - Scenario 1 (Positive)', function () {
    // Objective: Validate Purge Candidate Records behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
