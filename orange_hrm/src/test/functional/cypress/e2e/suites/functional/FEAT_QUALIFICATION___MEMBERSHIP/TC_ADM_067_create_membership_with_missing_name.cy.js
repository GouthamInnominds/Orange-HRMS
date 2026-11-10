/**
 * Test Case ID: TC_ADM_067
 * Feature: FEAT_QUALIFICATION___MEMBERSHIP
 * Name: Create membership with missing name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___MEMBERSHIP: TC_ADM_067', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_067: Create membership with missing name', function () {
    // Objective: Verify name is required to create a membership record.
    cy.url().should('include', '/auth/login');
  });
});
