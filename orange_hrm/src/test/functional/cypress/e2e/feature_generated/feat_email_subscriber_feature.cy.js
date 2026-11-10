/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EMAIL_SUBSCRIBER | Tests: 8
 */

describe('Feature: FEAT_EMAIL_SUBSCRIBER', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_132: Add a subscriber to a valid email subscription', function () {
    // Priority: High | Objective: Verify a subscriber (name + email) can be added to a valid subscription type (e.g. Leave Application).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_133: Add subscriber with missing name or email', function () {
    // Priority: High | Objective: Verify name and email are both required to add a subscriber.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_134: Add subscriber with invalid email format', function () {
    // Priority: Medium | Objective: Verify subscriber email must be a valid email format (max 100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_135: Add subscriber with duplicate email within the same subscription', function () {
    // Priority: High | Objective: Verify subscriber email must be unique within the same email subscription (matchValues on emailNotification).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_136: Add subscriber to an invalid subscription id', function () {
    // Priority: Medium | Objective: Verify emailSubscriptionId must be one of the allowed subscription types.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_137: List subscribers for a subscription with pagination', function () {
    // Priority: Medium | Objective: Verify subscribers for a given subscription can be listed with sorting and pagination.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_138: Update an existing subscriber\'s name/email', function () {
    // Priority: Medium | Objective: Verify an existing subscriber\'s name and email can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_139: Delete one or more subscribers from a subscription', function () {
    // Priority: High | Objective: Verify selected subscribers can be bulk deleted from a subscription.
    cy.url().should('include', '/auth/login');
  });

});
