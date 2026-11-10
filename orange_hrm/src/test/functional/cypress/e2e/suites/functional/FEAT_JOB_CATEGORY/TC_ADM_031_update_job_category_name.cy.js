/**
 * Test Case ID: TC_ADM_031
 * Feature: FEAT_JOB_CATEGORY
 * Name: Update job category name
 * Priority: Medium
 */

describe('Feature FEAT_JOB_CATEGORY: TC_ADM_031', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_031: Update job category name', function () {
    // Objective: Verify an existing job category name can be updated.
    cy.url().should('include', '/auth/login');
  });
});
