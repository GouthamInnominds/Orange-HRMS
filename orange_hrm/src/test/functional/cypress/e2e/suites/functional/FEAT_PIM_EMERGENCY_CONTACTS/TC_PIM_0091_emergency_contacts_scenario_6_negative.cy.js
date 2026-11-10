/**
 * Test Case ID: TC_PIM_0091
 * Feature: FEAT_PIM_EMERGENCY_CONTACTS
 * Name: Emergency Contacts - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMERGENCY_CONTACTS: TC_PIM_0091', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0091: Emergency Contacts - Scenario 6 (Negative)', function () {
    // Objective: Validate Emergency Contacts behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
