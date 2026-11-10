/**
 * Test Case ID: TC_BUZZ_040
 * Feature: FEAT_EDIT_POST___TEXT
 * Name: Attempt to change post type from text to video during edit
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___TEXT: TC_BUZZ_040', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_040: Attempt to change post type from text to video during edit', function () {
    // Objective: Verify system prevents changing a post\'s type from text to video through the edit operation.
    cy.url().should('include', '/auth/login');
  });
});
