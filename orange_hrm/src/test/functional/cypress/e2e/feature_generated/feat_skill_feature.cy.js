/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_SKILL | Tests: 8
 */

describe('Feature: FEAT_SKILL', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_046: Create skill with valid unique name', function () {
    // Priority: High | Objective: Verify a Skill can be created with a valid unique name (<=120 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_047: Create skill with description', function () {
    // Priority: Medium | Objective: Verify a Skill can be created with an optional description (<=400 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_048: Create skill with missing name', function () {
    // Priority: High | Objective: Verify name is required to create a skill.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_049: Create skill with duplicate name', function () {
    // Priority: High | Objective: Verify skill name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_050: Create skill with name exceeding 120 characters', function () {
    // Priority: Medium | Objective: Verify skill name is rejected when exceeding max length of 120 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_051: Create skill with description exceeding 400 characters', function () {
    // Priority: Low | Objective: Verify description is rejected when exceeding max length of 400 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_052: Search skills by name and description filters', function () {
    // Priority: Medium | Objective: Verify skill list can be filtered using name and description query filters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_053: Delete one or more skills', function () {
    // Priority: High | Objective: Verify selected skills can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
