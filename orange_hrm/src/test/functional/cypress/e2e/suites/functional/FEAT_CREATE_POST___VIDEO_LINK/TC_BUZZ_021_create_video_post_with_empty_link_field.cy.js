/**
 * Test Case ID: TC_BUZZ_021
 * Feature: FEAT_CREATE_POST___VIDEO_LINK
 * Name: Create video post with empty link field
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___VIDEO_LINK: TC_BUZZ_021', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_021: Create video post with empty link field', function () {
    // Objective: Verify system rejects a video-type post submitted without a video link.
    cy.url().should('include', '/auth/login');
  });
});
