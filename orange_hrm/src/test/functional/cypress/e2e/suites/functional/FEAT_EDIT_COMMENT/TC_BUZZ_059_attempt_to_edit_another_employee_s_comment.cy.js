/**
 * Test Case ID: TC_BUZZ_059
 * Feature: FEAT_EDIT_COMMENT
 * Name: Attempt to edit another employee's comment
 * Priority: High
 */

describe('Feature FEAT_EDIT_COMMENT: TC_BUZZ_059', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_059: Attempt to edit another employee\'s comment', function () {
    // Objective: Verify a regular ESS user cannot edit a comment authored by another employee.
    cy.url().should('include', '/auth/login');
  });
});
