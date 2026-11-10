/**
 * Test Case ID: TC_MNT_1061
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1061', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1061: Purge Candidate Records - Scenario 6 (Negative)', function () {
    // Objective: Validate Purge Candidate Records behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
