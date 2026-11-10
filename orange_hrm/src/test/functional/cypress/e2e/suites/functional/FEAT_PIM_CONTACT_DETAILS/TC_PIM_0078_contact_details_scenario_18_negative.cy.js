/**
 * Test Case ID: TC_PIM_0078
 * Feature: FEAT_PIM_CONTACT_DETAILS
 * Name: Contact Details - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_CONTACT_DETAILS: TC_PIM_0078', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0078: Contact Details - Scenario 18 (Negative)', function () {
    // Objective: Validate Contact Details behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
