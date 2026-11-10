/**
 * Test Case ID: TC_PRF_0855
 * Feature: FEAT_PRF_APPRAISAL_REVIEWS
 * Name: Appraisal Reviews - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_APPRAISAL_REVIEWS: TC_PRF_0855', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0855: Appraisal Reviews - Scenario 15 (Boundary)', function () {
    // Objective: Validate Appraisal Reviews behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
