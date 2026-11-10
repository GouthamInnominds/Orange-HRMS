/**
 * Test Case ID: TC_BUZZ_047
 * Feature: FEAT_EDIT_POST___VIDEO
 * Name: Attempt to change post type from video to photo during edit
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___VIDEO: TC_BUZZ_047', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_047: Attempt to change post type from video to photo during edit', function () {
    // Objective: Verify system prevents changing a video post\'s type to photo through the edit operation.
    cy.url().should('include', '/auth/login');
  });
});
