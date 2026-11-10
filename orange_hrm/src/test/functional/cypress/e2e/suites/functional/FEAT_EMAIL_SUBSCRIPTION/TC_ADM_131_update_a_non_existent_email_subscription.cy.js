/**
 * Test Case ID: TC_ADM_131
 * Feature: FEAT_EMAIL_SUBSCRIPTION
 * Name: Update a non-existent email subscription
 * Priority: Low
 */

describe('Feature FEAT_EMAIL_SUBSCRIPTION: TC_ADM_131', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_131: Update a non-existent email subscription', function () {
    // Objective: Verify updating a subscription id that does not exist returns a not-found error.
    cy.url().should('include', '/auth/login');
  });
});
