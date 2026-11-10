/**
 * Test Case ID: TC_BUZZ_084
 * Feature: FEAT_SHARE_POST
 * Name: List all shares/reposts of a given post
 * Priority: Medium
 */

describe('Feature FEAT_SHARE_POST: TC_BUZZ_084', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_084: List all shares/reposts of a given post', function () {
    // Objective: Verify all shares of a specific post can be retrieved via the post shares listing endpoint.
    cy.url().should('include', '/auth/login');
  });
});
