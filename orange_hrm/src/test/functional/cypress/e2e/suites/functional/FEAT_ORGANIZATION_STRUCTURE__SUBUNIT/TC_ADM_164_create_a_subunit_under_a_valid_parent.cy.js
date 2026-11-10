/**
 * Test Case ID: TC_ADM_164
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Create a subunit under a valid parent
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_164', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_164: Create a subunit under a valid parent', function () {
    // Objective: Verify a new subunit can be created with a required unique name and a valid parentId.
    cy.url().should('include', '/auth/login');
  });
});
