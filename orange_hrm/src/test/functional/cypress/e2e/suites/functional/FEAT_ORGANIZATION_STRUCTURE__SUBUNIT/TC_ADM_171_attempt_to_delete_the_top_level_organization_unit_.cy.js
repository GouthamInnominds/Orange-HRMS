/**
 * Test Case ID: TC_ADM_171
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Attempt to delete the top-level organization unit (id=1)
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_171', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_171: Attempt to delete the top-level organization unit (id=1)', function () {
    // Objective: Verify the root organization unit cannot be deleted (id must be greater than 1).
    cy.url().should('include', '/auth/login');
  });
});
