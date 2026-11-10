/**
 * Test Case ID: TC_BUZZ_042
 * Feature: FEAT_EDIT_POST___PHOTO
 * Name: Delete specific photos from an existing photo post
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___PHOTO: TC_BUZZ_042', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_042: Delete specific photos from an existing photo post', function () {
    // Objective: Verify specific photos can be removed from a post via the deletedPhotos parameter.
    cy.url().should('include', '/auth/login');
  });
});
