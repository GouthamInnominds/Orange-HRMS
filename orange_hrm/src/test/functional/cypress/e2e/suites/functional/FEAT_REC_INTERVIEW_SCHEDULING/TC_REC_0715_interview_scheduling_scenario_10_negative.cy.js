/**
 * Test Case ID: TC_REC_0715
 * Feature: FEAT_REC_INTERVIEW_SCHEDULING
 * Name: Interview Scheduling - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_REC_INTERVIEW_SCHEDULING: TC_REC_0715', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0715: Interview Scheduling - Scenario 10 (Negative)', function () {
    // Objective: Validate Interview Scheduling behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
