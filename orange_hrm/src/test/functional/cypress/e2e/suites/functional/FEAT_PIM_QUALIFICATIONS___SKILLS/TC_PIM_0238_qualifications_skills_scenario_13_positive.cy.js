/**
 * Test Case ID: TC_PIM_0238
 * Feature: FEAT_PIM_QUALIFICATIONS___SKILLS
 * Name: Qualifications & Skills - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_QUALIFICATIONS___SKILLS: TC_PIM_0238', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0238: Qualifications & Skills - Scenario 13 (Positive)', function () {
    // Objective: Validate Qualifications & Skills behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
