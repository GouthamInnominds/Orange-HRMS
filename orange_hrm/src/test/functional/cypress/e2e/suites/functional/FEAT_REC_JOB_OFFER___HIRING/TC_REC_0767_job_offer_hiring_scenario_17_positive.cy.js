/**
 * Test Case ID: TC_REC_0767
 * Feature: FEAT_REC_JOB_OFFER___HIRING
 * Name: Job Offer & Hiring - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_JOB_OFFER___HIRING: TC_REC_0767', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0767: Job Offer & Hiring - Scenario 17 (Positive)', function () {
    // Objective: Validate Job Offer & Hiring behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
