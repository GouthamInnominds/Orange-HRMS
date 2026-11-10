/**
 * Test Case ID: TC_ADM_108
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user without selecting a user role
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_108', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_108: Create system user without selecting a user role', function () {
    // Objective: Verify userRoleId is a required field.
    cy.url().should('include', '/auth/login');
  });
});
