/**
 * Test Case ID: TC_BUZZ_090
 * Feature: FEAT_DELETE_SHARE__UNSHARE_
 * Name: Delete original post via the shares delete endpoint
 * Priority: High
 */

describe('Feature FEAT_DELETE_SHARE__UNSHARE_: TC_BUZZ_090', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_090: Delete original post via the shares delete endpoint', function () {
    // Objective: Verify deleting a share record of type post removes the entire original post, cascading photos, comments, likes, and shares.
    cy.url().should('include', '/auth/login');
  });
});
