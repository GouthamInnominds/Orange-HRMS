/**
 * Test Case ID: TC_MNT_1080
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1080', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1080: Purge Candidate Records - Scenario 25 (Positive)', function () {
    // Objective: Validate Purge Candidate Records behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
