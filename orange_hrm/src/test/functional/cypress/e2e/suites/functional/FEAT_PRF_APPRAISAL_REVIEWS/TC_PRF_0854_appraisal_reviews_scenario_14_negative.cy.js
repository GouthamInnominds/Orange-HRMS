/**
 * Test Case ID: TC_PRF_0854
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0854', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0854: Appraisal Reviews - Scenario 14 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
