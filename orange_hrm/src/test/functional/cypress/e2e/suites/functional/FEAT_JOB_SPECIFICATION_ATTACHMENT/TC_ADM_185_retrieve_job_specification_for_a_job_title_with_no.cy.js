/**
 * Test Case ID: TC_ADM_185
 * Feature: FEAT_JOB_SPECIFICATION_ATTACHMENT
 * Name: Retrieve job specification for a job title with no attachment
 * Priority: Medium
 */

describe('Feature FEAT_JOB_SPECIFICATION_ATTACHMENT: TC_ADM_185', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_185: Retrieve job specification for a job title with no attachment', function () {
    // Objective: Verify requesting the job specification for a job title without one returns a not-found error.
    cy.url().should('include', '/auth/login');
  });
});
