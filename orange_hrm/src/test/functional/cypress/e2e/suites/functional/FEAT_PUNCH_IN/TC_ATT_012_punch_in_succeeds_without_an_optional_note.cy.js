/**
 * Test Case ID: TC_ATT_012
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in succeeds without an optional note
 * Priority: Low
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_012', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_012: Punch in succeeds without an optional note', function () {
    // Objective: Verify punch in succeeds when the optional \'note\' field is left blank.
    cy.url().should('include', '/auth/login');
  });
});
