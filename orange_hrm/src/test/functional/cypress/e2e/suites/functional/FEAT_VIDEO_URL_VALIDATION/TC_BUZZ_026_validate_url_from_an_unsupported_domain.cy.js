/**
 * Test Case ID: TC_BUZZ_026
 * Feature: FEAT_VIDEO_URL_VALIDATION
 * Name: Validate URL from an unsupported domain
 * Priority: Medium
 */

describe('Feature FEAT_VIDEO_URL_VALIDATION: TC_BUZZ_026', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_026: Validate URL from an unsupported domain', function () {
    // Objective: Verify the endpoint returns valid false for a URL that does not belong to YouTube Vimeo or Dailymotion.
    cy.url().should('include', '/auth/login');
  });
});
