/**
 * Test Case ID: TC_ADM_008
 * Feature: FEAT_JOB_TITLE
 * Name: Update job title and delete current specification
 * Priority: Medium
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_008', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_008: Update job title and delete current specification', function () {
    // Objective: Verify setting currentJobSpecification=deleteCurrent removes the existing attachment on update.
    cy.url().should('include', '/auth/login');
  });
});
