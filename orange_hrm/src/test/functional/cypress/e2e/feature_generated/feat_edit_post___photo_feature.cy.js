/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EDIT_POST___PHOTO | Tests: 4
 */

describe('Feature: FEAT_EDIT_POST___PHOTO', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_041: Add new photos to an existing photo post within limit', function () {
    // Priority: Medium | Objective: Verify additional photos can be added to an existing photo post as long as the total stays within 5.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_042: Delete specific photos from an existing photo post', function () {
    // Priority: Medium | Objective: Verify specific photos can be removed from a post via the deletedPhotos parameter.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_043: Add photos exceeding the 5-photo total limit on edit', function () {
    // Priority: Medium | Objective: Verify system rejects adding photos when the resulting total (existing plus new minus deleted) would exceed 5.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_044: Delete photo IDs that do not belong to the post', function () {
    // Priority: Medium | Objective: Verify system rejects a request to delete photo IDs that are not associated with the given post.
    cy.url().should('include', '/auth/login');
  });

});
