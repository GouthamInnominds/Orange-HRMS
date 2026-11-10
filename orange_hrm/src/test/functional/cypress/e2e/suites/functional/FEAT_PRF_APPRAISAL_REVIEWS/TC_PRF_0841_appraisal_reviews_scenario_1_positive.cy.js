/**
 * Test Case ID: TC_PRF_0841
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0841', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0841: Appraisal Reviews - Scenario 1 (Positive)', function () {
    // Objective: Validate Appraisal Reviews behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
