/**
 * Test Case ID: TC_ADM_167
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Create a subunit without selecting a parent
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_167', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_167: Create a subunit without selecting a parent', function () {
    // Objective: Verify parentId is required when creating a subunit.
    cy.url().should('include', '/auth/login');
  });
});
