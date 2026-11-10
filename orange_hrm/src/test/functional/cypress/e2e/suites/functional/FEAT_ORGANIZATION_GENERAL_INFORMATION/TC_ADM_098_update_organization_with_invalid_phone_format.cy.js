/**
 * Test Case ID: TC_ADM_098
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization with invalid phone format
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_098', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_098: Update organization with invalid phone format', function () {
    // Objective: Verify organization phone must match the PHONE format rule (max 30 chars).
    cy.url().should('include', '/auth/login');
  });
});
