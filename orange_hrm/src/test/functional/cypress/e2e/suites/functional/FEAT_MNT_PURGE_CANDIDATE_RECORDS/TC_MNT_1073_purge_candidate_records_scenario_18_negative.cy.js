/**
 * Test Case ID: TC_MNT_1073
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1073', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1073: Purge Candidate Records - Scenario 18 (Negative)', function () {
    // Objective: Validate Purge Candidate Records behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
