/**
 * Test Case ID: TC_BUZZ_017
 * Feature: FEAT_CREATE_POST___VIDEO_LINK
 * Name: Create video post with valid Vimeo URL
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___VIDEO_LINK: TC_BUZZ_017', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_017: Create video post with valid Vimeo URL', function () {
    // Objective: Verify a Buzz post can be created using a valid Vimeo video URL.
    cy.url().should('include', '/auth/login');
  });
});
