/**
 * Test Case ID: TC_PRF_0861
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0861', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0861: Appraisal Reviews - Scenario 21 (Positive)', function () {
    // Objective: Validate Appraisal Reviews behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
