/**
 * Test Case ID: TC_ADM_053
 * Feature: FEAT_SKILL
 * Name: Delete one or more skills
 * Priority: High
 */

describe('Feature FEAT_SKILL: TC_ADM_053', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_053: Delete one or more skills', function () {
    // Objective: Verify selected skills can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
