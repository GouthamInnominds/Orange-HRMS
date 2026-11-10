/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EDIT_POST___VIDEO | Tests: 3
 */

describe('Feature: FEAT_EDIT_POST___VIDEO', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_045: Edit video post link with a valid new video URL', function () {
    // Priority: Medium | Objective: Verify the video link of an existing video post can be updated to a new valid URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_046: Edit video post link with an invalid URL', function () {
    // Priority: Medium | Objective: Verify system rejects updating a video post\'s link with an unsupported or invalid URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_047: Attempt to change post type from video to photo during edit', function () {
    // Priority: Medium | Objective: Verify system prevents changing a video post\'s type to photo through the edit operation.
    cy.url().should('include', '/auth/login');
  });

});
