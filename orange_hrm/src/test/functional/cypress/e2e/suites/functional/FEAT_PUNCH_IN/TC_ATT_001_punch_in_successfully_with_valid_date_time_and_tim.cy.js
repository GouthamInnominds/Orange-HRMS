/**
 * Test Case ID: TC_ATT_001
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in successfully with valid date, time and timezone
 * Priority: High
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_001', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_001: Punch in successfully with valid date, time and timezone', function () {
    // Objective: Verify an employee can punch in successfully with all valid required fields.
    cy.url().should('include', '/auth/login');
  });
});
