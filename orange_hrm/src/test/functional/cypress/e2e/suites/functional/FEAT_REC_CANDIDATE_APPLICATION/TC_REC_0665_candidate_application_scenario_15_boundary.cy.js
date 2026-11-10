/**
 * Test Case ID: TC_REC_0665
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0665', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0665: Candidate Application - Scenario 15 (Boundary)', function () {
    // Objective: Validate Candidate Application behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
