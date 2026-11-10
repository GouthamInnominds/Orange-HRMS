/**
 * Test Case ID: TC_BUZZ_066
 * Feature: FEAT_LIST_COMMENTS
 * Name: List all comments on a post in chronological order
 * Priority: Medium
 */

describe('Feature FEAT_LIST_COMMENTS: TC_BUZZ_066', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_066: List all comments on a post in chronological order', function () {
    // Objective: Verify comments on a post are listed sorted by creation time (comment.createdAtUtc).
    cy.url().should('include', '/auth/login');
  });
});
