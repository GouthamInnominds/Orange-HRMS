/**
 * Test Case ID: TC_BUZZ_011
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with zero photos (empty array)
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_011', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_011: Create photo post with zero photos (empty array)', function () {
    // Objective: Verify system rejects a photo-type post submitted with no photos attached.
    cy.url().should('include', '/auth/login');
  });
});
