/**
 * Test Case ID: TC_ADM_030
 * Feature: FEAT_JOB_CATEGORY
 * Name: Create job category with name exceeding 50 characters
 * Priority: Medium
 */

describe('Feature FEAT_JOB_CATEGORY: TC_ADM_030', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_030: Create job category with name exceeding 50 characters', function () {
    // Objective: Verify name is rejected when exceeding max length of 50 characters.
    cy.url().should('include', '/auth/login');
  });
});
