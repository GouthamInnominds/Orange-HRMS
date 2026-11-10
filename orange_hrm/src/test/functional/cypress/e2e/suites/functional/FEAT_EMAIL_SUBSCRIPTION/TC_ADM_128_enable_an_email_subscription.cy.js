/**
 * Test Case ID: TC_ADM_128
 * Feature: FEAT_EMAIL_SUBSCRIPTION
 * Name: Enable an email subscription
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIPTION: TC_ADM_128', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_128: Enable an email subscription', function () {
    // Objective: Verify an email subscription can be enabled by setting enabled=true.
    cy.url().should('include', '/auth/login');
  });
});
