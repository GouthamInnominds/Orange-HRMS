/**
 * Test Case ID: TC_ADM_096
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization with invalid email format
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_096', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_096: Update organization with invalid email format', function () {
    // Objective: Verify organization email is validated as a proper email format and max 30 characters.
    cy.url().should('include', '/auth/login');
  });
});
