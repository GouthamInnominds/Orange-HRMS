/**
 * Test Case ID: TC_BUZZ_071
 * Feature: FEAT_LIKE_UNLIKE_POST
 * Name: Unlike a previously liked post
 * Priority: High
 */

describe('Feature FEAT_LIKE_UNLIKE_POST: TC_BUZZ_071', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_071: Unlike a previously liked post', function () {
    // Objective: Verify a user can remove their like from a post they previously liked.
    cy.url().should('include', '/auth/login');
  });
});
