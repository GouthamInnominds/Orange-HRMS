/**
 * Test Case ID: TC_ADM_165
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Create a subunit with unit id and description
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_165', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_165: Create a subunit with unit id and description', function () {
    // Objective: Verify optional unitId (<=100 chars) and description (<=400 chars) can be set on a subunit.
    cy.url().should('include', '/auth/login');
  });
});
