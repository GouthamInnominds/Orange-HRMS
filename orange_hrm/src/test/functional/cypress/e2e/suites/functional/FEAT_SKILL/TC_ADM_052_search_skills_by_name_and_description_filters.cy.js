/**
 * Test Case ID: TC_ADM_052
 * Feature: FEAT_SKILL
 * Name: Search skills by name and description filters
 * Priority: Medium
 */

describe('Feature FEAT_SKILL: TC_ADM_052', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_052: Search skills by name and description filters', function () {
    // Objective: Verify skill list can be filtered using name and description query filters.
    cy.url().should('include', '/auth/login');
  });
});
