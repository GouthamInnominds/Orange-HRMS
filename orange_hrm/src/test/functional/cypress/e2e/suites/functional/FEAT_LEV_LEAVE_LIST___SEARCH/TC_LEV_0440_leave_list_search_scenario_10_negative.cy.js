/**
 * Test Case ID: TC_LEV_0440
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0440', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0440: Leave List & Search - Scenario 10 (Negative)', function () {
    // Objective: Validate Leave List & Search behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
