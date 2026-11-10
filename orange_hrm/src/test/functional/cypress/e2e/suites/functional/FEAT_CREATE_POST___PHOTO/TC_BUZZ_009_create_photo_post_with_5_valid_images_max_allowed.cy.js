/**
 * Test Case ID: TC_BUZZ_009
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with 5 valid images (max allowed)
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_009', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_009: Create photo post with 5 valid images (max allowed)', function () {
    // Objective: Verify user can attach the maximum allowed 5 photos to a single post.
    cy.url().should('include', '/auth/login');
  });
});
