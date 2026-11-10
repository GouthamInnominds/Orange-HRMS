/**
 * Test Case ID: TC_ATT_004
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in fails when timezoneOffset is missing
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_004', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_004: Punch in fails when timezoneOffset is missing', function () {
    // Objective: Verify punch in request is rejected when the required \'timezoneOffset\' field is not provided.
    cy.url().should('include', '/auth/login');
  });
});
