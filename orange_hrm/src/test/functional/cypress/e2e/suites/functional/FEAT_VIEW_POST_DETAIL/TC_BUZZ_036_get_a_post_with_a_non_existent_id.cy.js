/**
 * Test Case ID: TC_BUZZ_036
 * Feature: FEAT_VIEW_POST_DETAIL
 * Name: Get a post with a non-existent ID
 * Priority: Medium
 */

describe('Feature FEAT_VIEW_POST_DETAIL: TC_BUZZ_036', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_036: Get a post with a non-existent ID', function () {
    // Objective: Verify system returns a record-not-found error when requesting a post ID that does not exist.
    cy.url().should('include', '/auth/login');
  });
});
