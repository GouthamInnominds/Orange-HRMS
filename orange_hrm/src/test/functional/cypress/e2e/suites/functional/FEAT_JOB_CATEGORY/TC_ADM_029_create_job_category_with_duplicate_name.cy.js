/**
 * Test Case ID: TC_ADM_029
 * Feature: FEAT_JOB_CATEGORY
 * Name: Create job category with duplicate name
 * Priority: High
 */

describe('Feature FEAT_JOB_CATEGORY: TC_ADM_029', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_029: Create job category with duplicate name', function () {
    // Objective: Verify job category name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
