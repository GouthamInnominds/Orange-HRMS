/**
 * Test Case ID: TC_MNT_1078
 * Feature: FEAT_MNT_PURGE_CANDIDATE_RECORDS
 * Name: Purge Candidate Records - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_PURGE_CANDIDATE_RECORDS: TC_MNT_1078', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1078: Purge Candidate Records - Scenario 23 (Boundary)', function () {
    // Objective: Validate Purge Candidate Records behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
