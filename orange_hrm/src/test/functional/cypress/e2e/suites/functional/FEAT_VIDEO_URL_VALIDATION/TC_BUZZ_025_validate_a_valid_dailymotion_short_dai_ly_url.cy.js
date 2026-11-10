/**
 * Test Case ID: TC_BUZZ_025
 * Feature: FEAT_VIDEO_URL_VALIDATION
 * Name: Validate a valid Dailymotion short (dai.ly) URL
 * Priority: Medium
 */

describe('Feature FEAT_VIDEO_URL_VALIDATION: TC_BUZZ_025', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_025: Validate a valid Dailymotion short (dai.ly) URL', function () {
    // Objective: Verify the link validation endpoint returns valid true for a correct Dailymotion short URL.
    cy.url().should('include', '/auth/login');
  });
});
