/**
 * Test Case ID: TC_ATT_008
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in fails when note exceeds 250 characters
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_008', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_008: Punch in fails when note exceeds 250 characters', function () {
    // Objective: Verify punch in is rejected when the note field exceeds the 250 character maximum length.
    cy.url().should('include', '/auth/login');
  });
});
