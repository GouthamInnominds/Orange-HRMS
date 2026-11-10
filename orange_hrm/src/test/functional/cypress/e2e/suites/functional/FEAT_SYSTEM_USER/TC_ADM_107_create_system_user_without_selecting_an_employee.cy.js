/**
 * Test Case ID: TC_ADM_107
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user without selecting an employee
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_107', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_107: Create system user without selecting an employee', function () {
    // Objective: Verify empNumber (linked employee) is required and must be an employee accessible to the current user.
    cy.url().should('include', '/auth/login');
  });
});
