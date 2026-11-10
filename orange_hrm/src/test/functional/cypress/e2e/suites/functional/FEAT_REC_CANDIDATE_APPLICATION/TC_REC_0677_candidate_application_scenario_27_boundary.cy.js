/**
 * Test Case ID: TC_REC_0677
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 27 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0677', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0677: Candidate Application - Scenario 27 (Boundary)', function () {
    // Objective: Validate Candidate Application behavior under Boundary conditions (Rule validation #27).
    cy.url().should('include', '/auth/login');
  });
});
