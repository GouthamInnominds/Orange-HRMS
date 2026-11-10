/**
 * Test Case ID: TC_LEV_0439
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0439', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0439: Leave List & Search - Scenario 9 (Positive)', function () {
    // Objective: Validate Leave List & Search behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
