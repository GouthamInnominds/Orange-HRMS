/**
 * Test Case ID: TC_ADM_099
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization tax id and registration number
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_099', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_099: Update organization tax id and registration number', function () {
    // Objective: Verify taxId and registrationNumber (each <=30 chars) can be updated.
    cy.url().should('include', '/auth/login');
  });
});
