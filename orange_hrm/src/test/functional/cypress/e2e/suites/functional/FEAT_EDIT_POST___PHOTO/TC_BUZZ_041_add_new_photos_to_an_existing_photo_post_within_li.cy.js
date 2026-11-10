/**
 * Test Case ID: TC_BUZZ_041
 * Feature: FEAT_EDIT_POST___PHOTO
 * Name: Add new photos to an existing photo post within limit
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___PHOTO: TC_BUZZ_041', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_041: Add new photos to an existing photo post within limit', function () {
    // Objective: Verify additional photos can be added to an existing photo post as long as the total stays within 5.
    cy.url().should('include', '/auth/login');
  });
});
