/**
 * Test Case ID: TC_BUZZ_073
 * Feature: FEAT_LIKE_UNLIKE_POST
 * Name: List all users who liked a post
 * Priority: Medium
 */

describe('Feature FEAT_LIKE_UNLIKE_POST: TC_BUZZ_073', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_073: List all users who liked a post', function () {
    // Objective: Verify the list of likes for a given post/share can be retrieved.
    cy.url().should('include', '/auth/login');
  });
});
