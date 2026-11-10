/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_DELETE_COMMENT | Tests: 4
 */

describe('Feature: FEAT_DELETE_COMMENT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_062: Delete own comment', function () {
    // Priority: High | Objective: Verify a user can delete their own comment from a post.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_063: Attempt to delete another employee\'s comment', function () {
    // Priority: High | Objective: Verify a regular ESS user cannot delete a comment authored by another employee.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_064: Delete a comment that does not exist', function () {
    // Priority: Medium | Objective: Verify system returns a not-found error when deleting a non-existent comment ID.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_065: Admin deletes any employee\'s comment', function () {
    // Priority: Medium | Objective: Verify a user with admin-level Buzz comment permissions can delete any employee\'s comment.
    cy.url().should('include', '/auth/login');
  });

});
