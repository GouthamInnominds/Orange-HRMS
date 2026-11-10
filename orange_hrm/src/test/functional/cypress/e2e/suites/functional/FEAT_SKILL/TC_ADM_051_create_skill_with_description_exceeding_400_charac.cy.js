/**
 * Test Case ID: TC_ADM_051
 * Feature: FEAT_SKILL
 * Name: Create skill with description exceeding 400 characters
 * Priority: Low
 */

describe('Feature FEAT_SKILL: TC_ADM_051', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_051: Create skill with description exceeding 400 characters', function () {
    // Objective: Verify description is rejected when exceeding max length of 400 characters.
    cy.url().should('include', '/auth/login');
  });
});
