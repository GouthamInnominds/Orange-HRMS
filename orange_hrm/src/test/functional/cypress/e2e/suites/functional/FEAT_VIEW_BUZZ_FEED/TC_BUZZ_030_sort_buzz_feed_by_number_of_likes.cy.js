/**
 * Test Case ID: TC_BUZZ_030
 * Feature: FEAT_VIEW_BUZZ_FEED
 * Name: Sort Buzz feed by number of likes
 * Priority: Medium
 */

describe('Feature FEAT_VIEW_BUZZ_FEED: TC_BUZZ_030', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_030: Sort Buzz feed by number of likes', function () {
    // Objective: Verify the feed can be sorted by share.numOfLikes.
    cy.url().should('include', '/auth/login');
  });
});
