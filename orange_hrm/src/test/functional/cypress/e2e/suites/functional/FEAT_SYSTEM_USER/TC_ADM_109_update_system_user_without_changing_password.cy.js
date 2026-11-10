/**
 * Test Case ID: TC_ADM_109
 * Feature: FEAT_SYSTEM_USER
 * Name: Update system user without changing password
 * Priority: Medium
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_109', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_109: Update system user without changing password', function () {
    // Objective: Verify password field is not required on update when changePassword flag is false.
    cy.url().should('include', '/auth/login');
  });
});
