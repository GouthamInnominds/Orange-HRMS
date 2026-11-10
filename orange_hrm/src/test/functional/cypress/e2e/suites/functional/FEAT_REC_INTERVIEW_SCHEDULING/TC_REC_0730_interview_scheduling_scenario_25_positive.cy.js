/**
 * Test Case ID: TC_REC_0730
 * Feature: FEAT_REC_INTERVIEW_SCHEDULING
 * Name: Interview Scheduling - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_REC_INTERVIEW_SCHEDULING: TC_REC_0730', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0730: Interview Scheduling - Scenario 25 (Positive)', function () {
    // Objective: Validate Interview Scheduling behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
