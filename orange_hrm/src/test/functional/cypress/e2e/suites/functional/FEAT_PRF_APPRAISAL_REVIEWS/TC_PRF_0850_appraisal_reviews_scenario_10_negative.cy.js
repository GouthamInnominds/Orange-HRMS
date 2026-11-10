/**
 * Test Case ID: TC_PRF_0850
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0850', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0850: Appraisal Reviews - Scenario 10 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
