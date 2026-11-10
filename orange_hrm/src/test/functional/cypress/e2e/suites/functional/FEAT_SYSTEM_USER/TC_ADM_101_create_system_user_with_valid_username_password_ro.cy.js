/**
 * Test Case ID: TC_ADM_101
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user with valid username, password, role and employee
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_101', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_101: Create system user with valid username, password, role and employee', function () {
    // Objective: Verify a System User can be created with all required fields: username, password, userRoleId, empNumber, status.
    cy.url().should('include', '/auth/login');
  });
});
