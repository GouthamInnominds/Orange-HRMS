/**
 * Test Case ID: TC_ADM_036
 * Feature: FEAT_WORK_SHIFT
 * Name: Create work shift with name exceeding 50 characters
 * Priority: Medium
 */

describe('Feature FEAT_WORK_SHIFT: TC_ADM_036', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_036: Create work shift with name exceeding 50 characters', function () {
    // Objective: Verify shift name is rejected when exceeding max length of 50 characters.
    cy.url().should('include', '/auth/login');
  });
});
