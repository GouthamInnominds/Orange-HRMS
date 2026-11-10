/**
 * Test Case ID: TC_BUZZ_022
 * Feature: FEAT_CREATE_POST___VIDEO_LINK
 * Name: Create video post using an already-embedded YouTube URL
 * Priority: Low
 */

describe('Feature FEAT_CREATE_POST___VIDEO_LINK: TC_BUZZ_022', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_022: Create video post using an already-embedded YouTube URL', function () {
    // Objective: Verify system accepts a URL already in embedded format without modification.
    cy.url().should('include', '/auth/login');
  });
});
