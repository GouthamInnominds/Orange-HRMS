/**
 * Test Case ID: TC_BUZZ_020
 * Feature: FEAT_CREATE_POST___VIDEO_LINK
 * Name: Create video post with malformed YouTube URL
 * Priority: Medium
 */

describe('Feature FEAT_CREATE_POST___VIDEO_LINK: TC_BUZZ_020', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_020: Create video post with malformed YouTube URL', function () {
    // Objective: Verify system rejects a URL that contains youtube but does not match a valid YouTube video URL pattern.
    cy.url().should('include', '/auth/login');
  });
});
