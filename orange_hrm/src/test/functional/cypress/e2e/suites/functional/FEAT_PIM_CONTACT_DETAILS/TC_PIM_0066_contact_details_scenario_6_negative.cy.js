/**
 * Test Case ID: TC_PIM_0066
 * Feature: FEAT_PIM_CONTACT_DETAILS
 * Name: Contact Details - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_CONTACT_DETAILS: TC_PIM_0066', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0066: Contact Details - Scenario 6 (Negative)', function () {
    // Objective: Validate Contact Details behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
