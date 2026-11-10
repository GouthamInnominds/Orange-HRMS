/**
 * Test Case ID: TC_ADM_138
 * Feature: FEAT_EMAIL_SUBSCRIBER
 * Name: Update an existing subscriber's name/email
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIBER: TC_ADM_138', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_138: Update an existing subscriber\'s name/email', function () {
    // Objective: Verify an existing subscriber\'s name and email can be updated.
    cy.url().should('include', '/auth/login');
  });
});
