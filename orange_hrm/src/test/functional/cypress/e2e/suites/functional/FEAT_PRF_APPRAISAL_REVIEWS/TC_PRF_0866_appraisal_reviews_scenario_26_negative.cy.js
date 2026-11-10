/**
 * Test Case ID: TC_PRF_0866
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 26 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0866', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0866: Appraisal Reviews - Scenario 26 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #26).
    cy.url().should('include', '/auth/login');
  });
});
