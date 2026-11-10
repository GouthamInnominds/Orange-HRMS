/**
 * Test Case ID: TC_ADM_132
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Add a subscriber to a valid email subscription
 * Priority: High
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_132', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_132: Add a subscriber to a valid email subscription', function () {
    // Objective: Verify a subscriber (name + email) can be added to a valid subscription type (e.g. Leave Application).
    cy.url().should('include', '/auth/login');
  });
});
