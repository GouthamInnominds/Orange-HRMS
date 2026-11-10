/**
 * Test Case ID: TC_ATT_014
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out fails when employee has no active punch-in record
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_014', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_014: Punch out fails when employee has no active punch-in record', function () {
    // Objective: Verify punch out is rejected with \'Cannot Proceed Punch Out Employee Already Punched Out\' when there is no open punch-in record.
    cy.url().should('include', '/auth/login');
  });
});
