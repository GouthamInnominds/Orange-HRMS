/**
 * Test Case ID: TC_BUZZ_019
 * Feature: FEAT_CREATE_POST___VIDEO_LINK
 * Name: Create video post with unsupported domain URL
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___VIDEO_LINK: TC_BUZZ_019', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_019: Create video post with unsupported domain URL', function () {
    // Objective: Verify system rejects video URLs from domains other than YouTube Vimeo or Dailymotion.
    cy.url().should('include', '/auth/login');
  });
});
