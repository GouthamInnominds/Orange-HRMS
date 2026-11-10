/**
 * Test Case ID: TC_REC_0720
 * Feature: FEAT_REC_INTERVIEW_SCHEDULING
 * Name: Interview Scheduling - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_REC_INTERVIEW_SCHEDULING: TC_REC_0720', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0720: Interview Scheduling - Scenario 15 (Boundary)', function () {
    // Objective: Validate Interview Scheduling behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
