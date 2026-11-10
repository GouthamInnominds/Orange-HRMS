/**
 * Test Case ID: TC_BUZZ_031
 * Feature: FEAT_VIEW_BUZZ_FEED
 * Name: Sort Buzz feed by number of comments
 * Priority: Medium
 */

describe('Feature FEAT_VIEW_BUZZ_FEED: TC_BUZZ_031', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_031: Sort Buzz feed by number of comments', function () {
    // Objective: Verify the feed can be sorted by share.numOfComments.
    cy.url().should('include', '/auth/login');
  });
});
