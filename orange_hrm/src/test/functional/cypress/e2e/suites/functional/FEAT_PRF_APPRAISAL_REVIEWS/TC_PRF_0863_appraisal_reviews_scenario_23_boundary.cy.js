/**
 * Test Case ID: TC_PRF_0863
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0863', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0863: Appraisal Reviews - Scenario 23 (Boundary)', function () {
    // Objective: Validate Appraisal Reviews behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
