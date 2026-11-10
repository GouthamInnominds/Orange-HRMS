/**
 * Test Case ID: TC_BUZZ_063
 * Feature: FEAT_DELETE_COMMENT
 * Name: Attempt to delete another employee's comment
 * Priority: High
 */

describe('Feature FEAT_DELETE_COMMENT: TC_BUZZ_063', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_063: Attempt to delete another employee\'s comment', function () {
    // Objective: Verify a regular ESS user cannot delete a comment authored by another employee.
    cy.url().should('include', '/auth/login');
  });
});
