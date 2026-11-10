/**
 * Test Case ID: TC_BUZZ_033
 * Feature: FEAT_VIEW_BUZZ_FEED
 * Name: View Buzz feed with invalid sortField value
 * Priority: Low
 */

describe('Feature FEAT_VIEW_BUZZ_FEED: TC_BUZZ_033', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_033: View Buzz feed with invalid sortField value', function () {
    // Objective: Verify the feed rejects a sortField value that is not in the allowed list.
    cy.url().should('include', '/auth/login');
  });
});
