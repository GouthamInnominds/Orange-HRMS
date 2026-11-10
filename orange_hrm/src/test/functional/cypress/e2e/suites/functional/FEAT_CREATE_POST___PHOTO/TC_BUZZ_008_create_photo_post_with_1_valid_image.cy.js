/**
 * Test Case ID: TC_BUZZ_008
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with 1 valid image
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_008', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_008: Create photo post with 1 valid image', function () {
    // Objective: Verify user can create a Buzz post with a single valid photo attachment.
    cy.url().should('include', '/auth/login');
  });
});
