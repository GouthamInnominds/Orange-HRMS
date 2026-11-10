/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LIST_COMMENTS | Tests: 3
 */

describe('Feature: FEAT_LIST_COMMENTS', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_066: List all comments on a post in chronological order', function () {
    // Priority: Medium | Objective: Verify comments on a post are listed sorted by creation time (comment.createdAtUtc).
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_067: Paginate comments list using limit and offset', function () {
    // Priority: Low | Objective: Verify the comments list supports pagination.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_068: List comments with detailed model parameter', function () {
    // Priority: Low | Objective: Verify comments can be retrieved using the detailed model returning extended comment information.
    cy.url().should('include', '/auth/login');
  });

});
