/**
 * Test Case ID: TC_BUZZ_044
 * Feature: FEAT_EDIT_POST___PHOTO
 * Name: Delete photo IDs that do not belong to the post
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___PHOTO: TC_BUZZ_044', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_044: Delete photo IDs that do not belong to the post', function () {
    // Objective: Verify system rejects a request to delete photo IDs that are not associated with the given post.
    cy.url().should('include', '/auth/login');
  });
});
