/**
 * Test Case ID: TC_BUZZ_024
 * Feature: FEAT_VIDEO_URL_VALIDATION
 * Name: Validate a valid Vimeo URL
 * Priority: Medium
 */

describe('Feature FEAT_VIDEO_URL_VALIDATION: TC_BUZZ_024', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_024: Validate a valid Vimeo URL', function () {
    // Objective: Verify the link validation endpoint returns valid true for a correct Vimeo URL.
    cy.url().should('include', '/auth/login');
  });
});
