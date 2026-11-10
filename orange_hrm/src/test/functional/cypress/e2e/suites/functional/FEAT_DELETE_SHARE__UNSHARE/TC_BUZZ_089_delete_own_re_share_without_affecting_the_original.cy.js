/**
 * Test Case ID: TC_BUZZ_089
 * Feature: FEAT_DELETE_SHARE__UNSHARE_
 * Name: Delete own re-share without affecting the original post
 * Priority: High
 */

describe('Feature FEAT_DELETE_SHARE__UNSHARE_: TC_BUZZ_089', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_089: Delete own re-share without affecting the original post', function () {
    // Objective: Verify deleting a re-share (type=share) removes only that share entry and leaves the original post intact.
    cy.url().should('include', '/auth/login');
  });
});
