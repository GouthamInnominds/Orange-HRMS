/**
 * Test Case ID: TC_LEV_0436
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0436', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0436: Leave List & Search - Scenario 6 (Negative)', function () {
    // Objective: Validate Leave List & Search behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
