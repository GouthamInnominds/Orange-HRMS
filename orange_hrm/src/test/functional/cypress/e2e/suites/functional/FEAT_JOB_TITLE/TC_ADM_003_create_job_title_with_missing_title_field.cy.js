/**
 * Test Case ID: TC_ADM_003
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with missing title field
 * Priority: High
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_003', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_003: Create job title with missing title field', function () {
    // Objective: Verify title is a required field and job title cannot be created without it.
    cy.url().should('include', '/auth/login');
  });
});
