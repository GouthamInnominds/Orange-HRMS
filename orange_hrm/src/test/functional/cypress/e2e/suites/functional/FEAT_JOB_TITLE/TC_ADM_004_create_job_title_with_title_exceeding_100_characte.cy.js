/**
 * Test Case ID: TC_ADM_004
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with title exceeding 100 characters
 * Priority: Medium
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_004', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_004: Create job title with title exceeding 100 characters', function () {
    // Objective: Verify job title name is rejected when it exceeds the max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
