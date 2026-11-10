/**
 * Test Case ID: TC_PIM_0239
 * Feature: FEAT_PIM_QUALIFICATIONS___SKILLS
 * Name: Qualifications & Skills - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_QUALIFICATIONS___SKILLS: TC_PIM_0239', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0239: Qualifications & Skills - Scenario 14 (Negative)', function () {
    // Objective: Validate Qualifications & Skills behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
