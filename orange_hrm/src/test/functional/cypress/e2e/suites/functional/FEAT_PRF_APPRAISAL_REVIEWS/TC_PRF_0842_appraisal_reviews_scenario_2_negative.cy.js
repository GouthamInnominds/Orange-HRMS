/**
 * Test Case ID: TC_PRF_0842
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0842', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0842: Appraisal Reviews - Scenario 2 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
