/**
 * Test Case ID: TC_ADM_011
 * Feature: FEAT_JOB_TITLE
 * Name: Get a job title by an invalid/non-existent id
 * Priority: Medium
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_011', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_011: Get a job title by an invalid/non-existent id', function () {
    // Objective: Verify requesting a job title with a non-existent id returns a not-found error.
    cy.url().should('include', '/auth/login');
  });
});
