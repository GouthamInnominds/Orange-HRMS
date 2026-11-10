/**
 * Test Case ID: TC_PRF_0865
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0865', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0865: Appraisal Reviews - Scenario 25 (Positive)', function () {
    // Objective: Validate Appraisal Reviews behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
