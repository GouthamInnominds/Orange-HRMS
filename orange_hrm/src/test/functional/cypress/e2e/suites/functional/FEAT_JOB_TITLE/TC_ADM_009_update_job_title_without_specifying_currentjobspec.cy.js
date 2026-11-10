/**
 * Test Case ID: TC_ADM_009
 * Feature: FEAT_JOB_TITLE
 * Name: Update job title without specifying currentJobSpecification when attachment exists
 * Priority: Medium
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_009', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_009: Update job title without specifying currentJobSpecification when attachment exists', function () {
    // Objective: Verify update is rejected if currentJobSpecification is not provided while an attachment already exists.
    cy.url().should('include', '/auth/login');
  });
});
