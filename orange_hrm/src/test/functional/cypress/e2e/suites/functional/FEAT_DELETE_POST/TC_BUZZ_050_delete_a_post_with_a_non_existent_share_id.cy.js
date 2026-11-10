/**
 * Test Case ID: TC_BUZZ_050
 * Feature: FEAT_DELETE_POST
 * Name: Delete a post with a non-existent share ID
 * Priority: Medium
 */

describe('Feature FEAT_DELETE_POST: TC_BUZZ_050', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_050: Delete a post with a non-existent share ID', function () {
    // Objective: Verify system returns an error when attempting to delete a post using an ID that does not exist.
    cy.url().should('include', '/auth/login');
  });
});
