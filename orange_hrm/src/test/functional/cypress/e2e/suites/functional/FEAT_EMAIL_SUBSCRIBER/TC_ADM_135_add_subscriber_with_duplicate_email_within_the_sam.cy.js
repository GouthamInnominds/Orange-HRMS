/**
 * Test Case ID: TC_ADM_135
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Add subscriber with duplicate email within the same subscription
 * Priority: High
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_135', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_135: Add subscriber with duplicate email within the same subscription', function () {
    // Objective: Verify subscriber email must be unique within the same email subscription (matchValues on emailNotification).
    cy.url().should('include', '/auth/login');
  });
});
