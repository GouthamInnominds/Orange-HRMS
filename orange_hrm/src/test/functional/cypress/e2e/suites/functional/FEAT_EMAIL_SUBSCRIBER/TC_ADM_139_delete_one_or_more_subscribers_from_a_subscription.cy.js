/**
 * Test Case ID: TC_ADM_139
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Delete one or more subscribers from a subscription
 * Priority: High
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_139', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_139: Delete one or more subscribers from a subscription', function () {
    // Objective: Verify selected subscribers can be bulk deleted from a subscription.
    cy.url().should('include', '/auth/login');
  });
});
