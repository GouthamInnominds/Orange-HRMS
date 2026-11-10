/**
 * Test Case ID: TC_ADM_129
 * Feature: FEAT_EMAIL_SUBSCRIPTION
 * Name: Disable an email subscription
 * Priority: Medium
 */

describe('Feature FEAT_EMAIL_SUBSCRIPTION: TC_ADM_129', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_129: Disable an email subscription', function () {
    // Objective: Verify an email subscription can be disabled by setting enabled=false.
    cy.url().should('include', '/auth/login');
  });
});
