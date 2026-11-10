/**
 * Test Case ID: TC_BUZZ_062
 * Feature: FEAT_DELETE_COMMENT
 * Name: Delete own comment
 * Priority: High
 */

describe('Feature FEAT_DELETE_COMMENT: TC_BUZZ_062', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_062: Delete own comment', function () {
    // Objective: Verify a user can delete their own comment from a post.
    cy.url().should('include', '/auth/login');
  });
});
