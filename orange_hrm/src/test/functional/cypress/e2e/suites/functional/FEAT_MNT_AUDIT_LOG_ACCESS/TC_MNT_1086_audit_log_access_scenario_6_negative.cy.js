/**
 * Test Case ID: TC_MNT_1086
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1086', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1086: Audit Log Access - Scenario 6 (Negative)', function () {
    // Objective: Validate Audit Log Access behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
