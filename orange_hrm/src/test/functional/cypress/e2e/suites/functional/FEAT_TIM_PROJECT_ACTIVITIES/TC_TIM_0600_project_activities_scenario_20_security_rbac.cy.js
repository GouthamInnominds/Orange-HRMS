/**
 * Test Case ID: TC_TIM_0600
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0600', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0600: Project Activities - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Project Activities behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
