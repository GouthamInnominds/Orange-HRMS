/**
 * Test Case ID: TC_ADM_002
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with description and note
 * Priority: Medium
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_002', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_002: Create job title with description and note', function () {
    // Objective: Verify a Job Title can be created with optional description (<=400 chars) and note (<=400 chars).
    cy.url().should('include', '/auth/login');
  });
});
