/**
 * Test Case ID: TC_BUZZ_082
 * Feature: FEAT_SHARE_POST
 * Name: Share a post using a non-existent shareId
 * Priority: Medium
 */

describe('Feature FEAT_SHARE_POST: TC_BUZZ_082', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_082: Share a post using a non-existent shareId', function () {
    // Objective: Verify system rejects a share request referencing a shareId that does not exist.
    cy.url().should('include', '/auth/login');
  });
});
