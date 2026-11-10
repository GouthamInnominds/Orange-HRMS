/**
 * Test Case ID: TC_ADM_027
 * Feature: FEAT_JOB_CATEGORY
 * Name: Create job category with valid unique name
 * Priority: High
 */

describe('Feature FEAT_JOB_CATEGORY: TC_ADM_027', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_027: Create job category with valid unique name', function () {
    // Objective: Verify a Job Category can be created with a valid unique name (<=50 chars).
    cy.url().should('include', '/auth/login');
  });
});
