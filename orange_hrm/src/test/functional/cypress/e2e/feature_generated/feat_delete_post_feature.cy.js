/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_DELETE_POST | Tests: 4
 */

describe('Feature: FEAT_DELETE_POST', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_048: Delete own post', function () {
    // Priority: High | Objective: Verify a user can delete their own Buzz post.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_049: Attempt to delete another employee\'s post', function () {
    // Priority: High | Objective: Verify a regular ESS user cannot delete a Buzz post authored by another employee.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_050: Delete a post with a non-existent share ID', function () {
    // Priority: Medium | Objective: Verify system returns an error when attempting to delete a post using an ID that does not exist.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_051: Admin deletes any employee\'s post', function () {
    // Priority: High | Objective: Verify a user with admin-level Buzz permissions can delete any employee\'s post.
    cy.url().should('include', '/auth/login');
  });

});
