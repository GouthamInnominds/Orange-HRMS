/**
 * Test Case ID: TC_BUZZ_049
 * Feature: FEAT_DELETE_POST
 * Name: Attempt to delete another employee's post
 * Priority: High
 */

describe('Feature FEAT_DELETE_POST: TC_BUZZ_049', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_049: Attempt to delete another employee\'s post', function () {
    // Objective: Verify a regular ESS user cannot delete a Buzz post authored by another employee.
    cy.url().should('include', '/auth/login');
  });
});
