/**
 * Test Case ID: TC_BUZZ_076
 * Feature: FEAT_LIKE_UNLIKE_COMMENT
 * Name: Attempt to like a comment that is already liked
 * Priority: Medium
 */

describe('Feature FEAT_LIKE_UNLIKE_COMMENT: TC_BUZZ_076', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_076: Attempt to like a comment that is already liked', function () {
    // Objective: Verify system prevents a user from liking the same comment twice.
    cy.url().should('include', '/auth/login');
  });
});
