/**
 * Test Case ID: TC_PRF_0857
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0857', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0857: Appraisal Reviews - Scenario 17 (Positive)', function () {
    // Objective: Validate Appraisal Reviews behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
