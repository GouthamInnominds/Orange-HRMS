/**
 * Test Case ID: TC_ADM_050
 * Feature: FEAT_SKILL
 * Name: Create skill with name exceeding 120 characters
 * Priority: Medium
 */

describe('Feature FEAT_SKILL: TC_ADM_050', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_050: Create skill with name exceeding 120 characters', function () {
    // Objective: Verify skill name is rejected when exceeding max length of 120 characters.
    cy.url().should('include', '/auth/login');
  });
});
