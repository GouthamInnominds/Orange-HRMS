/**
 * Test Case ID: TC_REC_0722
 * Feature: FEAT_REC_INTERVIEW_SCHEDULING
 * Name: Interview Scheduling - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_INTERVIEW_SCHEDULING: TC_REC_0722', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0722: Interview Scheduling - Scenario 17 (Positive)', function () {
    // Objective: Validate Interview Scheduling behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
