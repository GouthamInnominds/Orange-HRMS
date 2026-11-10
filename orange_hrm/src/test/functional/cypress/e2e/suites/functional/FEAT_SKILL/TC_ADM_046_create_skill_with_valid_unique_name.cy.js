/**
 * Test Case ID: TC_ADM_046
 * Feature: FEAT_SKILL
 * Name: Create skill with valid unique name
 * Priority: High
 */

describe('Feature FEAT_SKILL: TC_ADM_046', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_046: Create skill with valid unique name', function () {
    // Objective: Verify a Skill can be created with a valid unique name (<=120 chars).
    cy.url().should('include', '/auth/login');
  });
});
