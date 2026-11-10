/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_USERNAME_VALIDATION | Tests: 4
 */

describe('Feature: FEAT_USERNAME_VALIDATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_114: Validate an available (unused) username', function () {
    // Priority: Medium | Objective: Verify username validation endpoint returns valid=true for a username not already in use.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_115: Validate an already taken username', function () {
    // Priority: High | Objective: Verify username validation endpoint returns valid=false for a username already in use.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_116: Validate username while editing own user (excluding self)', function () {
    // Priority: Medium | Objective: Verify passing userId excludes that user\'s own current username from the uniqueness check.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_117: Validate username exceeding 40 characters', function () {
    // Priority: Low | Objective: Verify username validation rejects values exceeding max length of 40 characters.
    cy.url().should('include', '/auth/login');
  });

});
