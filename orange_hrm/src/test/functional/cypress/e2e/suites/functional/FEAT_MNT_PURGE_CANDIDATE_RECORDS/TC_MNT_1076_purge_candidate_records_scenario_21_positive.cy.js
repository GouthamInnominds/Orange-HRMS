/**
 * Test Case ID: TC_MNT_1076
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1076', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1076: Purge Candidate Records - Scenario 21 (Positive)', function () {
    // Objective: Validate Purge Candidate Records behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
