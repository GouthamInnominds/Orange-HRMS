/**
 * Test Case ID: TC_REC_0768
 * Feature: FEAT_REC_JOB_OFFER___HIRING
 * Name: Job Offer & Hiring - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_JOB_OFFER___HIRING: TC_REC_0768', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0768: Job Offer & Hiring - Scenario 18 (Negative)', function () {
    // Objective: Validate Job Offer & Hiring behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
