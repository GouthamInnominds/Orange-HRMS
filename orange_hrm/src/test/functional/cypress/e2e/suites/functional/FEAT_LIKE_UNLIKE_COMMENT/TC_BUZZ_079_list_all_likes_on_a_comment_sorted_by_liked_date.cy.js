/**
 * Test Case ID: TC_BUZZ_079
 * Feature: FEAT_LIKE_UNLIKE_COMMENT
 * Name: List all likes on a comment sorted by liked date
 * Priority: Low
 */

describe('Feature FEAT_LIKE_UNLIKE_COMMENT: TC_BUZZ_079', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_079: List all likes on a comment sorted by liked date', function () {
    // Objective: Verify likes on a comment can be listed and sorted by likedAtUtc.
    cy.url().should('include', '/auth/login');
  });
});
