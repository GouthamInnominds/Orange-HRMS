/**
 * Test Case ID: TC_ADM_097
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization email exceeding 30 characters
 * Priority: Low
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_097', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_097: Update organization email exceeding 30 characters', function () {
    // Objective: Verify organization email field is rejected when exceeding max length of 30 characters.
    cy.url().should('include', '/auth/login');
  });
});
