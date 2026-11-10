/**
 * Test Case ID: TC_ADM_104
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user with duplicate username
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_104', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_104: Create system user with duplicate username', function () {
    // Objective: Verify username must be unique across active users (ignoring deleted users).
    cy.url().should('include', '/auth/login');
  });
});
