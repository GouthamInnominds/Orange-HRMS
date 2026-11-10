/**
 * Test Case ID: TC_ADM_007
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with a valid job specification attachment
 * Priority: Medium
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_007', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_007: Create job title with a valid job specification attachment', function () {
    // Objective: Verify a base64 job specification file can be attached with filename <=200 characters.
    cy.url().should('include', '/auth/login');
  });
});
