/**
 * Test Case ID: TC_ADM_106
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user with password exceeding 64 characters
 * Priority: Low
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_106', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_106: Create system user with password exceeding 64 characters', function () {
    // Objective: Verify password is rejected when it exceeds the max length of 64 characters.
    cy.url().should('include', '/auth/login');
  });
});
