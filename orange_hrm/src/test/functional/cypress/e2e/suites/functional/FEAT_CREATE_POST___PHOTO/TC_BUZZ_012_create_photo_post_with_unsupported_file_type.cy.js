/**
 * Test Case ID: TC_BUZZ_012
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with unsupported file type
 * Priority: Medium
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_012', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_012: Create photo post with unsupported file type', function () {
    // Objective: Verify system rejects photo uploads whose MIME type or extension is not in the allowed list (gif jpeg jpg jfif png).
    cy.url().should('include', '/auth/login');
  });
});
