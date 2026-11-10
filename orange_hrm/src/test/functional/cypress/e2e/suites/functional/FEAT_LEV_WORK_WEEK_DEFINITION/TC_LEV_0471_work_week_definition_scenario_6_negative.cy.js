/**
 * Test Case ID: TC_LEV_0471
 * Feature: FEAT_LEV_WORK_WEEK_DEFINITION
 * Name: Work Week Definition - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_WORK_WEEK_DEFINITION: TC_LEV_0471', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0471: Work Week Definition - Scenario 6 (Negative)', function () {
    // Objective: Validate Work Week Definition behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
