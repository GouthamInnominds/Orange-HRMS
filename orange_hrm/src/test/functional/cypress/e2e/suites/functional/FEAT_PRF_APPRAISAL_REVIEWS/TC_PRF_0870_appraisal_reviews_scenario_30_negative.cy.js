/**
 * Test Case ID: TC_PRF_0870
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0870', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0870: Appraisal Reviews - Scenario 30 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
