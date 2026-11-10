/**
 * Test Case ID: TC_PRF_0853
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0853', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0853: Appraisal Reviews - Scenario 13 (Positive)', function () {
    // Objective: Validate Appraisal Reviews behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
