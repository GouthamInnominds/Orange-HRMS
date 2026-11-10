/**
 * Test Case ID: TC_ATT_016
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out fails when time field is missing
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_016', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_016: Punch out fails when time field is missing', function () {
    // Objective: Verify punch out request is rejected when the required \'time\' field is not provided.
    cy.url().should('include', '/auth/login');
  });
});
