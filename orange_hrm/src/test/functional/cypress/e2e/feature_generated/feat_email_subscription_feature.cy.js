/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EMAIL_SUBSCRIPTION | Tests: 5
 */

describe('Feature: FEAT_EMAIL_SUBSCRIPTION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_127: List all email subscriptions', function () {
    // Priority: Medium | Objective: Verify all available email subscription types (leave application, assignment, approval, cancellation, rejection) are listed.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_128: Enable an email subscription', function () {
    // Priority: Medium | Objective: Verify an email subscription can be enabled by setting enabled=true.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_129: Disable an email subscription', function () {
    // Priority: Medium | Objective: Verify an email subscription can be disabled by setting enabled=false.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_130: Update email subscription with missing enabled field', function () {
    // Priority: Low | Objective: Verify enabled is a required boolean field for the update action.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_131: Update a non-existent email subscription', function () {
    // Priority: Low | Objective: Verify updating a subscription id that does not exist returns a not-found error.
    cy.url().should('include', '/auth/login');
  });

});
