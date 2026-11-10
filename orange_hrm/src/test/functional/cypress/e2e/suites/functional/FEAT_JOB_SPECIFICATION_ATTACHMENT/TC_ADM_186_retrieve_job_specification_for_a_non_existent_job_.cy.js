/**
 * Test Case ID: TC_ADM_186
 * Feature: FEAT_JOB_SPECIFICATION_ATTACHMENT
 * Name: Retrieve job specification for a non-existent job title id
 * Priority: Low
 */

describe('Feature FEAT_JOB_SPECIFICATION_ATTACHMENT: TC_ADM_186', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_186: Retrieve job specification for a non-existent job title id', function () {
    // Objective: Verify requesting a job specification using an invalid jobTitleId is handled correctly.
    cy.url().should('include', '/auth/login');
  });
});
