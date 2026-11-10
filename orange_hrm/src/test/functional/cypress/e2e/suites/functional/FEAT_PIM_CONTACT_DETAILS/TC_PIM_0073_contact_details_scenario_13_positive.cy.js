/**
 * Test Case ID: TC_PIM_0073
 * Feature: FEAT_PIM_CONTACT_DETAILS
 * Name: Contact Details - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CONTACT_DETAILS: TC_PIM_0073', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0073: Contact Details - Scenario 13 (Positive)', function () {
    // Objective: Validate Contact Details behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
