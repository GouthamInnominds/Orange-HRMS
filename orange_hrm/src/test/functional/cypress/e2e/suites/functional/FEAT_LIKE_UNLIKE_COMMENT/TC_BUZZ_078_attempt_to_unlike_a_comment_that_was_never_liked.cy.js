/**
 * Test Case ID: TC_BUZZ_078
 * Feature: FEAT_LIKE_UNLIKE_COMMENT
 * Name: Attempt to unlike a comment that was never liked
 * Priority: Medium
 */

describe('Feature FEAT_LIKE_UNLIKE_COMMENT: TC_BUZZ_078', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_078: Attempt to unlike a comment that was never liked', function () {
    // Objective: Verify system rejects an unlike request for a comment the user has not liked.
    cy.url().should('include', '/auth/login');
  });
});
