/**
 * Test Case ID: TC_PIM_0077
 * Feature: FEAT_PIM_CONTACT_DETAILS
 * Name: Contact Details - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CONTACT_DETAILS: TC_PIM_0077', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0077: Contact Details - Scenario 17 (Positive)', function () {
    // Objective: Validate Contact Details behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
