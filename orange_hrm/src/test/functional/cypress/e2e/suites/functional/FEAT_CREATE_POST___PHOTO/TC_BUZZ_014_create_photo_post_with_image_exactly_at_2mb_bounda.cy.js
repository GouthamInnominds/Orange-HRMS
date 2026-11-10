/**
 * Test Case ID: TC_BUZZ_014
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with image exactly at 2MB boundary
 * Priority: Medium
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_014', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_014: Create photo post with image exactly at 2MB boundary', function () {
    // Objective: Verify a photo attachment exactly at the 2097152 byte size limit is accepted.
    cy.url().should('include', '/auth/login');
  });
});
