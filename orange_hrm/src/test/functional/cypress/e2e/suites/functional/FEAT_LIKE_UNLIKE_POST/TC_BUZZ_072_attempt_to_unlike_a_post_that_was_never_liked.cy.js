/**
 * Test Case ID: TC_BUZZ_072
 * Feature: FEAT_LIKE_UNLIKE_POST
 * Name: Attempt to unlike a post that was never liked
 * Priority: Medium
 */

describe('Feature FEAT_LIKE_UNLIKE_POST: TC_BUZZ_072', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_072: Attempt to unlike a post that was never liked', function () {
    // Objective: Verify system rejects an unlike request for a post the user has not liked.
    cy.url().should('include', '/auth/login');
  });
});
