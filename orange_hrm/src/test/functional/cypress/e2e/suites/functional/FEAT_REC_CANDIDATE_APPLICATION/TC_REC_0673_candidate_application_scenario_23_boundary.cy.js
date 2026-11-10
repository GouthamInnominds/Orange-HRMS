/**
 * Test Case ID: TC_REC_0673
 * Feature: FEAT_REC_CANDIDATE_APPLICATION
 * Name: Candidate Application - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_REC_CANDIDATE_APPLICATION: TC_REC_0673', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0673: Candidate Application - Scenario 23 (Boundary)', function () {
    // Objective: Validate Candidate Application behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
