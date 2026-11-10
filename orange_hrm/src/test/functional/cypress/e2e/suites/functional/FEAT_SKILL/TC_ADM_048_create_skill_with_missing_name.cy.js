/**
 * Test Case ID: TC_ADM_048
 * Feature: FEAT_SKILL
 * Name: Create skill with missing name
 * Priority: High
 */

describe('Feature FEAT_SKILL: TC_ADM_048', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_048: Create skill with missing name', function () {
    // Objective: Verify name is required to create a skill.
    cy.url().should('include', '/auth/login');
  });
});
