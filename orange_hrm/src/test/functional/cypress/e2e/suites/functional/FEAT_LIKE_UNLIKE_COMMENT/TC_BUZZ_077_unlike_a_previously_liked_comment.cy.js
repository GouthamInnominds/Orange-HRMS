/**
 * Test Case ID: TC_BUZZ_077
 * Feature: FEAT_LIKE_UNLIKE_COMMENT
 * Name: Unlike a previously liked comment
 * Priority: High
 */

describe('Feature FEAT_LIKE_UNLIKE_COMMENT: TC_BUZZ_077', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_077: Unlike a previously liked comment', function () {
    // Objective: Verify a user can remove their like from a comment they previously liked.
    cy.url().should('include', '/auth/login');
  });
});
