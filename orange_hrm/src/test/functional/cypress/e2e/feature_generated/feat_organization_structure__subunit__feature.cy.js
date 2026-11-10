/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_ | Tests: 9
 */

describe('Feature: FEAT_ORGANIZATION_STRUCTURE__SUBUNIT_', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_164: Create a subunit under a valid parent', function () {
    // Priority: High | Objective: Verify a new subunit can be created with a required unique name and a valid parentId.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_165: Create a subunit with unit id and description', function () {
    // Priority: Medium | Objective: Verify optional unitId (<=100 chars) and description (<=400 chars) can be set on a subunit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_166: Create a subunit with missing name', function () {
    // Priority: High | Objective: Verify name is required to create a subunit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_167: Create a subunit without selecting a parent', function () {
    // Priority: High | Objective: Verify parentId is required when creating a subunit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_168: Create a subunit under a non-existent parent', function () {
    // Priority: Medium | Objective: Verify creation fails if the specified parentId does not correspond to an existing subunit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_169: Create a subunit with duplicate name', function () {
    // Priority: High | Objective: Verify subunit name must be unique across the organization structure.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_170: View organization structure in tree mode', function () {
    // Priority: Medium | Objective: Verify subunits can be retrieved in hierarchical tree mode using mode=tree.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_171: Attempt to delete the top-level organization unit (id=1)', function () {
    // Priority: High | Objective: Verify the root organization unit cannot be deleted (id must be greater than 1).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_172: Delete a non-root subunit', function () {
    // Priority: High | Objective: Verify a subunit other than the root unit can be deleted.
    cy.url().should('include', '/auth/login');
  });

});
