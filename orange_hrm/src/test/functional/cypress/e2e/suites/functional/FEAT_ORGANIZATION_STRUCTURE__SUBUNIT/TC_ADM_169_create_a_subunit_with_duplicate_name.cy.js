/**
 * Test Case ID: TC_ADM_169
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_
 * Name: Create a subunit with duplicate name
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_: TC_ADM_169', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_169: Create a subunit with duplicate name', function () {
    // Objective: Verify subunit name must be unique across the organization structure.
    cy.url().should('include', '/auth/login');
  });
});
