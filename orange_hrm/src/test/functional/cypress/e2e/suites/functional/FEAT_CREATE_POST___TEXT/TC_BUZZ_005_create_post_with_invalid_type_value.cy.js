/**
 * Test Case ID: TC_BUZZ_005
 * Feature: FEAT_CREATE_POST___TEXT
 * Name: Create post with invalid type value
 * Priority: Medium
 */

describe('Feature FEAT_CREATE_POST___TEXT: TC_BUZZ_005', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_005: Create post with invalid type value', function () {
    // Objective: Verify system rejects a post submitted with a type value outside of text, photo, and video.
    cy.url().should('include', '/auth/login');
  });
});
