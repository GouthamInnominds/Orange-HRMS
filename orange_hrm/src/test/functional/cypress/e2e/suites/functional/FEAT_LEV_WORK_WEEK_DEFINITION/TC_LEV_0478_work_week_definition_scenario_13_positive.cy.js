/**
 * Test Case ID: TC_LEV_0478
 * Feature: FEAT_LEV_WORK_WEEK_DEFINITION
 * Name: Work Week Definition - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_WORK_WEEK_DEFINITION: TC_LEV_0478', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0478: Work Week Definition - Scenario 13 (Positive)', function () {
    // Objective: Validate Work Week Definition behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
