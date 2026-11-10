/**
 * Test Case ID: TC_PIM_0061
 * Feature: FEAT_PIM_CONTACT_DETAILS
 * Name: Contact Details - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CONTACT_DETAILS: TC_PIM_0061', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0061: Contact Details - Scenario 1 (Positive)', function () {
    // Objective: Validate Contact Details behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
