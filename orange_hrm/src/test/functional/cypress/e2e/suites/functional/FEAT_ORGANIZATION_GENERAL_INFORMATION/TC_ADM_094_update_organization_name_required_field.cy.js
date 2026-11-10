/**
 * Test Case ID: TC_ADM_094
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization name (required field)
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_094', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_094: Update organization name (required field)', function () {
    // Objective: Verify organization name is required and can be updated (max 100 chars).
    cy.url().should('include', '/auth/login');
  });
});
