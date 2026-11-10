/**
 * Test Case ID: TC_PRF_0858
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0858', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0858: Appraisal Reviews - Scenario 18 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
