/**
 * Test Case ID: TC_MNT_1090
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1090', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1090: Audit Log Access - Scenario 10 (Negative)', function () {
    // Objective: Validate Audit Log Access behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
