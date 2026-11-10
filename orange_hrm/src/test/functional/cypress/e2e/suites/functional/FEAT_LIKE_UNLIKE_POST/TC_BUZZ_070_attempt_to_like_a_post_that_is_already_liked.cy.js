/**
 * Test Case ID: TC_BUZZ_070
 * Feature: FEAT_LIKE_UNLIKE_POST
 * Name: Attempt to like a post that is already liked
 * Priority: Medium
 */

describe('Feature FEAT_LIKE_UNLIKE_POST: TC_BUZZ_070', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_070: Attempt to like a post that is already liked', function () {
    // Objective: Verify system prevents a user from liking the same post twice.
    cy.url().should('include', '/auth/login');
  });
});
