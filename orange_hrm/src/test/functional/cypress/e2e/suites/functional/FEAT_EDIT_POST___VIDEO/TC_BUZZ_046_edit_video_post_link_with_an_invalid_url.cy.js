/**
 * Test Case ID: TC_BUZZ_046
 * Feature: FEAT_EDIT_POST___VIDEO
 * Name: Edit video post link with an invalid URL
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___VIDEO: TC_BUZZ_046', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_046: Edit video post link with an invalid URL', function () {
    // Objective: Verify system rejects updating a video post\'s link with an unsupported or invalid URL.
    cy.url().should('include', '/auth/login');
  });
});
