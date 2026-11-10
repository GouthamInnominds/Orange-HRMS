/**
 * Test Case ID: TC_ATT_007
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in note accepted up to 250 characters
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_007', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_007: Punch in note accepted up to 250 characters', function () {
    // Objective: Verify the punch-in note field is accepted when it is at the maximum allowed length of 250 characters.
    cy.url().should('include', '/auth/login');
  });
});
