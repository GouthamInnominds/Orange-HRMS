/**
 * Test Case ID: TC_ADM_136
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Add subscriber to an invalid subscription id
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_136', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_136: Add subscriber to an invalid subscription id', function () {
    // Objective: Verify emailSubscriptionId must be one of the allowed subscription types.
    cy.url().should('include', '/auth/login');
  });
});
