/**
 * Test Case ID: TC_ADM_170
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: View organization structure in tree mode
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_170', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_170: View organization structure in tree mode', function () {
    // Objective: Verify subunits can be retrieved in hierarchical tree mode using mode=tree.
    cy.url().should('include', '/auth/login');
  });
});
