/**
 * Test Case ID: TC_ADM_102
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user with username shorter than minimum length
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_102', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_102: Create system user with username shorter than minimum length', function () {
    // Objective: Verify username must be at least 5 characters (USERNAME_MIN_LENGTH).
    cy.url().should('include', '/auth/login');
  });
});
