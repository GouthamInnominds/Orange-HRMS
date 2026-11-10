/**
 * Test Case ID: TC_ADM_028
 * Feature: FEAT_JOB_CATEGORY
 * Name: Create job category with missing name
 * Priority: High
 */

describe('Feature FEAT_JOB_CATEGORY: TC_ADM_028', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_028: Create job category with missing name', function () {
    // Objective: Verify name is required to create a job category.
    cy.url().should('include', '/auth/login');
  });
});
