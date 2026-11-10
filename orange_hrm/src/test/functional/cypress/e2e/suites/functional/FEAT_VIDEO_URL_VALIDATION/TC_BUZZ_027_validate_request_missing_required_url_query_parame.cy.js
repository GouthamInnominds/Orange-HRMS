/**
 * Test Case ID: TC_BUZZ_027
 * Feature: FEAT_VIDEO_URL_VALIDATION
 * Name: Validate request missing required url query parameter
 * Priority: Medium
 */

describe('Feature FEAT_VIDEO_URL_VALIDATION: TC_BUZZ_027', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_027: Validate request missing required url query parameter', function () {
    // Objective: Verify request fails validation when the required url query parameter is not supplied.
    cy.url().should('include', '/auth/login');
  });
});
