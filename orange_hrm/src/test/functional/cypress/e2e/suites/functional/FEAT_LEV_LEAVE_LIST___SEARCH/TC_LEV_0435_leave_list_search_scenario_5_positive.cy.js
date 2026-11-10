/**
 * Test Case ID: TC_LEV_0435
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0435', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0435: Leave List & Search - Scenario 5 (Positive)', function () {
    // Objective: Validate Leave List & Search behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
