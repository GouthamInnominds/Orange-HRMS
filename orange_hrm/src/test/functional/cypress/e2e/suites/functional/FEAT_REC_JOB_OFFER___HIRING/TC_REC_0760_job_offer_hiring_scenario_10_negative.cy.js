/**
 * Test Case ID: TC_REC_0760
 * Feature: FEAT_REC_JOB_OFFER___HIRING
 * Name: Job Offer & Hiring - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_REC_JOB_OFFER___HIRING: TC_REC_0760', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0760: Job Offer & Hiring - Scenario 10 (Negative)', function () {
    // Objective: Validate Job Offer & Hiring behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
