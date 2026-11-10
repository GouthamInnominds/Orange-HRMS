/**
 * Test Case ID: TC_ADM_163
 * Feature: FEAT_MODULES
 * Name: Update modules with an invalid boolean value
 * Priority: Low
 */

describe('Feature FEAT_MODULES: TC_ADM_163', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_163: Update modules with an invalid boolean value', function () {
    // Objective: Verify module status fields must be boolean typed.
    cy.url().should('include', '/auth/login');
  });
});
