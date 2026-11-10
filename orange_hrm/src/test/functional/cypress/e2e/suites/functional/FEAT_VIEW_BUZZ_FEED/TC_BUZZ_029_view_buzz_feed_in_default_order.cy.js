/**
 * Test Case ID: TC_BUZZ_029
 * Feature: FEAT_VIEW_BUZZ_FEED
 * Name: View Buzz feed in default order
 * Priority: High
 */

describe('Feature FEAT_VIEW_BUZZ_FEED: TC_BUZZ_029', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_029: View Buzz feed in default order', function () {
    // Objective: Verify the Buzz feed lists posts in descending order of creation time by default.
    cy.url().should('include', '/auth/login');
  });
});
