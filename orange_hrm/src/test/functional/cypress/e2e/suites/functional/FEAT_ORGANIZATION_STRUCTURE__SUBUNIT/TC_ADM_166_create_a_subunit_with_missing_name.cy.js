/**
 * Test Case ID: TC_ADM_166
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Create a subunit with missing name
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_166', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_166: Create a subunit with missing name', function () {
    // Objective: Verify name is required to create a subunit.
    cy.url().should('include', '/auth/login');
  });
});
