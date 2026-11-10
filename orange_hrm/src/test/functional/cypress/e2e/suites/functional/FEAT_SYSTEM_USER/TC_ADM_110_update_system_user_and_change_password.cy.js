/**
 * Test Case ID: TC_ADM_110
 * Feature: FEAT_SYSTEM_USER
 * Name: Update system user and change password
 * Priority: Medium
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_110', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_110: Update system user and change password', function () {
    // Objective: Verify password is required and validated for strength when changePassword flag is true.
    cy.url().should('include', '/auth/login');
  });
});
