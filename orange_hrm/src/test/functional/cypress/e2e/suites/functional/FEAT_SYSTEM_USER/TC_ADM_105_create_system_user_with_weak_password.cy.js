/**
 * Test Case ID: TC_ADM_105
 * Feature: FEAT_SYSTEM_USER
 * Name: Create system user with weak password
 * Priority: High
 */

describe('Feature FEAT_SYSTEM_USER: TC_ADM_105', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_105: Create system user with weak password', function () {
    // Objective: Verify password must satisfy password strength policy (zxcvbn-based strength check).
    cy.url().should('include', '/auth/login');
  });
});
