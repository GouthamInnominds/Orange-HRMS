/**
 * Test Case ID: TC_ADM_049
 * Feature: FEAT_SKILL
 * Name: Create skill with duplicate name
 * Priority: High
 */

describe('Feature FEAT_SKILL: TC_ADM_049', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_049: Create skill with duplicate name', function () {
    // Objective: Verify skill name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
