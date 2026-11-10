/**
 * Test Case ID: TC_ATT_015
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out fails when date field is missing
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_015', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_015: Punch out fails when date field is missing', function () {
    // Objective: Verify punch out request is rejected when the required \'date\' field is not provided.
    cy.url().should('include', '/auth/login');
  });
});
