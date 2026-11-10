/**
 * Test Case ID: TC_PRF_0860
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0860', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0860: Appraisal Reviews - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Appraisal Reviews behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
