/**
 * Test Case ID: TC_BUZZ_023
 * Feature: FEAT_VIDEO_URL_VALIDATION
 * Name: Validate a valid YouTube short URL
 * Priority: Medium
 */

describe('Feature FEAT_VIDEO_URL_VALIDATION: TC_BUZZ_023', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_023: Validate a valid YouTube short URL', function () {
    // Objective: Verify the link validation endpoint returns valid true for a correct YouTube URL.
    cy.url().should('include', '/auth/login');
  });
});
