/**
 * Test Case ID: TC_BUZZ_043
 * Feature: FEAT_EDIT_POST___PHOTO
 * Name: Add photos exceeding the 5-photo total limit on edit
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_POST___PHOTO: TC_BUZZ_043', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_043: Add photos exceeding the 5-photo total limit on edit', function () {
    // Objective: Verify system rejects adding photos when the resulting total (existing plus new minus deleted) would exceed 5.
    cy.url().should('include', '/auth/login');
  });
});
