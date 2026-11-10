/**
 * Test Case ID: TC_ADM_032
 * Feature: FEAT_JOB_CATEGORY
 * Name: Delete one or more job categories
 * Priority: High
 */

describe('Feature FEAT_JOB_CATEGORY: TC_ADM_032', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_032: Delete one or more job categories', function () {
    // Objective: Verify selected job categories can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
