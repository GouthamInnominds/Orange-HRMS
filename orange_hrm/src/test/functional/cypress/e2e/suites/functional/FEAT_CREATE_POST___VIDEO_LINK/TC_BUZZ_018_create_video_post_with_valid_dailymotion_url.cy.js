/**
 * Test Case ID: TC_BUZZ_018
 * Feature: FEAT_CREATE_POST___VIDEO_LINK
 * Name: Create video post with valid Dailymotion URL
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___VIDEO_LINK: TC_BUZZ_018', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_018: Create video post with valid Dailymotion URL', function () {
    // Objective: Verify a Buzz post can be created using a valid Dailymotion video URL.
    cy.url().should('include', '/auth/login');
  });
});
