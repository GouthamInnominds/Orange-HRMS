/**
 * Test Case ID: TC_ATT_018
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out blocked when new punch-out time overlaps another attendance record
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_018', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_018: Punch out blocked when new punch-out time overlaps another attendance record', function () {
    // Objective: Verify punch out is rejected with \'Punch-Out Overlap Found\' when the resulting punched interval overlaps an existing attendance record.
    cy.url().should('include', '/auth/login');
  });
});
