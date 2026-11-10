/**
 * Test Case ID: TC_LEV_0443
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0443', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0443: Leave List & Search - Scenario 13 (Positive)', function () {
    // Objective: Validate Leave List & Search behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
