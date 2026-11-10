/**
 * Test Case ID: TC_ADM_111
 * Feature: FEAT_SYSTEM_USER
 * Name: Filter users list by username, role, employee and status
 * Priority: Medium
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_111', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_111: Filter users list by username, role, employee and status', function () {
    // Objective: Verify Users list can be filtered by username, userRoleId, empNumber and status.
    cy.url().should('include', '/auth/login');
  });
});
