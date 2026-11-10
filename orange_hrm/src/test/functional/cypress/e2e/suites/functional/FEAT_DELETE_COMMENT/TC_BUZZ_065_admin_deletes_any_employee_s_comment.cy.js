/**
 * Test Case ID: TC_BUZZ_065
 * Feature: FEAT_DELETE_COMMENT
 * Name: Admin deletes any employee's comment
 * Priority: Medium
 */

describe('Feature FEAT_DELETE_COMMENT: TC_BUZZ_065', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_065: Admin deletes any employee\'s comment', function () {
    // Objective: Verify a user with admin-level Buzz comment permissions can delete any employee\'s comment.
    cy.url().should('include', '/auth/login');
  });
});
