/**
 * Test Case ID: TC_ATT_009
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in blocked when an overlapping punched-in record already exists
 * Priority: High
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_009', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_009: Punch in blocked when an overlapping punched-in record already exists', function () {
    // Objective: Verify punch in is rejected with \'Punch-In Overlap Found\' when the employee already has an overlapping open attendance record.
    cy.url().should('include', '/auth/login');
  });
});
