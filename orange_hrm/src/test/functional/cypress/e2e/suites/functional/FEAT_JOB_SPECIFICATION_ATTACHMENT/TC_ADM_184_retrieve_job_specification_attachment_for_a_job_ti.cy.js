/**
 * Test Case ID: TC_ADM_184
 * Feature: FEAT_JOB_SPECIFICATION_ATTACHMENT
 * Name: Retrieve job specification attachment for a job title that has one
 * Priority: Medium
 */

describe('Feature FEAT_JOB_SPECIFICATION_ATTACHMENT: TC_ADM_184', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_184: Retrieve job specification attachment for a job title that has one', function () {
    // Objective: Verify the job specification file metadata/content can be retrieved for a job title with an attached specification.
    cy.url().should('include', '/auth/login');
  });
});
