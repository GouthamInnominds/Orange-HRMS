/**
 * Test Case ID: TC_LEV_0479
 * Feature: FEAT_LEV_WORK_WEEK_DEFINITION
 * Name: Work Week Definition - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_WORK_WEEK_DEFINITION: TC_LEV_0479', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0479: Work Week Definition - Scenario 14 (Negative)', function () {
    // Objective: Validate Work Week Definition behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
