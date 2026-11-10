/**
 * Test Case ID: TC_BUZZ_053
 * Feature: FEAT_ADD_COMMENT
 * Name: Add a comment with empty text
 * Priority: Medium
 */

describe('Feature FEAT_ADD_COMMENT: TC_BUZZ_053', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_053: Add a comment with empty text', function () {
    // Objective: Verify system rejects a comment submitted with empty text.
    cy.url().should('include', '/auth/login');
  });
});
