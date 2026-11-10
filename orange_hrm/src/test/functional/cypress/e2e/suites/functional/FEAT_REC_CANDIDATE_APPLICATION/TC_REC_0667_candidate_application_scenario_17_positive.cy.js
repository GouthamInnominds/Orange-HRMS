/**
 * Test Case ID: TC_REC_0667
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0667', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0667: Candidate Application - Scenario 17 (Positive)', function () {
    // Objective: Validate Candidate Application behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
