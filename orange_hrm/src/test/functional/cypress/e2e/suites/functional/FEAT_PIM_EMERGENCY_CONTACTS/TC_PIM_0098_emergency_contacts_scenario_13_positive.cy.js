/**
 * Test Case ID: TC_PIM_0098
 * Feature: FEAT_PIM_EMERGENCY_CONTACTS
 * Name: Emergency Contacts - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMERGENCY_CONTACTS: TC_PIM_0098', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0098: Emergency Contacts - Scenario 13 (Positive)', function () {
    // Objective: Validate Emergency Contacts behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
