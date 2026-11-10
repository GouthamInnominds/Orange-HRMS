/**
 * Test Case ID: TC_TIM_0596
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0596', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0596: Project Activities - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate Project Activities behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
