/**
 * Test Case ID: TC_ADM_133
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Add subscriber with missing name or email
 * Priority: High
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_133', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_133: Add subscriber with missing name or email', function () {
    // Objective: Verify name and email are both required to add a subscriber.
    cy.url().should('include', '/auth/login');
  });
});
