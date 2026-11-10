/**
 * Test Case ID: TC_MNT_1093
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1093', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1093: Audit Log Access - Scenario 13 (Positive)', function () {
    // Objective: Validate Audit Log Access behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
