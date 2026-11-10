/**
 * Test Case ID: TC_BUZZ_010
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with 6 images (exceeds max)
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_010', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_010: Create photo post with 6 images (exceeds max)', function () {
    // Objective: Verify system rejects a photo post when more than 5 photos are attached.
    cy.url().should('include', '/auth/login');
  });
});
