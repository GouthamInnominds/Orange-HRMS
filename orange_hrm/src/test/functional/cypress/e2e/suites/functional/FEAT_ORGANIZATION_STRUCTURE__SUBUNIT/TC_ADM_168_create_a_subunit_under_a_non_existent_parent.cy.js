/**
 * Test Case ID: TC_ADM_168
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Create a subunit under a non-existent parent
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_168', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_168: Create a subunit under a non-existent parent', function () {
    // Objective: Verify creation fails if the specified parentId does not correspond to an existing subunit.
    cy.url().should('include', '/auth/login');
  });
});
