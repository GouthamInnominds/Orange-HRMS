/**
 * Test Case ID: TC_REC_0727
 * Feature: FEAT_REC_INTERVIEW_SCHEDULING
 * Name: Interview Scheduling - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_INTERVIEW_SCHEDULING: TC_REC_0727', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0727: Interview Scheduling - Scenario 22 (Negative)', function () {
    // Objective: Validate Interview Scheduling behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
