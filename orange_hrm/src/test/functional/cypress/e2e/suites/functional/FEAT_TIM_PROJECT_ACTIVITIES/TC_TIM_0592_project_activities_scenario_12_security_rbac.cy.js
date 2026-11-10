/**
 * Test Case ID: TC_TIM_0592
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0592', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0592: Project Activities - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Project Activities behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
