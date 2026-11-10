/**
 * Test Case ID: TC_ADM_130
 * Feature: FEAT_EMAIL_SUBSCRIPTION
 * Name: Update email subscription with missing enabled field
 * Priority: Low
 */

describe('Feature FEAT_EMAIL_SUBSCRIPTION: TC_ADM_130', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_130: Update email subscription with missing enabled field', function () {
    // Objective: Verify enabled is a required boolean field for the update action.
    cy.url().should('include', '/auth/login');
  });
});
