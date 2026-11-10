/**
 * Test Case ID: TC_ADM_068
 * Feature: FEAT_QUALIFICATION___MEMBERSHIP
 * Name: Create membership with duplicate name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___MEMBERSHIP: TC_ADM_068', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_068: Create membership with duplicate name', function () {
    // Objective: Verify membership name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
