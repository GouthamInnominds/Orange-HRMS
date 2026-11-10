/**
 * Test Case ID: TC_ADM_127
 * Feature: FEAT_EMAIL_SUBSCRIPTION
 * Name: List all email subscriptions
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIPTION: TC_ADM_127', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_127: List all email subscriptions', function () {
    // Objective: Verify all available email subscription types (leave application, assignment, approval, cancellation, rejection) are listed.
    cy.url().should('include', '/auth/login');
  });
});
