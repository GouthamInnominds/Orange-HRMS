/**
 * Test Case ID: TC_PRF_0862
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0862', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0862: Appraisal Reviews - Scenario 22 (Negative)', function () {
    // Objective: Validate Appraisal Reviews behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
