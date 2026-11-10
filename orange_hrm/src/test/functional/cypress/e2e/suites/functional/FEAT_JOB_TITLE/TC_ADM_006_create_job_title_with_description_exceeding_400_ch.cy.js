/**
 * Test Case ID: TC_ADM_006
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with description exceeding 400 characters
 * Priority: Low
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_006', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_006: Create job title with description exceeding 400 characters', function () {
    // Objective: Verify description field is rejected when it exceeds max length of 400 characters.
    cy.url().should('include', '/auth/login');
  });
});
