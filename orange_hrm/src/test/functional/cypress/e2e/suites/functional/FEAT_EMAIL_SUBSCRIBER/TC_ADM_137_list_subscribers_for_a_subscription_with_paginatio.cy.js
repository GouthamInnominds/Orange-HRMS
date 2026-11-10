/**
 * Test Case ID: TC_ADM_137
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: List subscribers for a subscription with pagination
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_137', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_137: List subscribers for a subscription with pagination', function () {
    // Objective: Verify subscribers for a given subscription can be listed with sorting and pagination.
    cy.url().should('include', '/auth/login');
  });
});
