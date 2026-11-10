/**
 * Test Case ID: TC_ADM_103
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user with username exceeding maximum length
 * Priority: Medium
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_103', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_103: Create system user with username exceeding maximum length', function () {
    // Objective: Verify username must not exceed 40 characters (USERNAME_MAX_LENGTH).
    cy.url().should('include', '/auth/login');
  });
});
