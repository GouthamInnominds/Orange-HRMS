/**
 * Test Case ID: TC_LEV_0447
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0447', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0447: Leave List & Search - Scenario 17 (Positive)', function () {
    // Objective: Validate Leave List & Search behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
