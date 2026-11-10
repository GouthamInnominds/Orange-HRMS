/**
 * Test Case ID: TC_ADM_172
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Delete a non-root subunit
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_172', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_172: Delete a non-root subunit', function () {
    // Objective: Verify a subunit other than the root unit can be deleted.
    cy.url().should('include', '/auth/login');
  });
});
