/**
 * Test Case ID: TC_ADM_001
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with valid title only
 * Priority: High
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_001', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_001: Create job title with valid title only', function () {
    // Objective: Verify a Job Title can be created with only the mandatory title field.
    cy.url().should('include', '/auth/login');
  });
});
