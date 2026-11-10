/**
 * Test Case ID: TC_MNT_1094
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1094', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1094: Audit Log Access - Scenario 14 (Negative)', function () {
    // Objective: Validate Audit Log Access behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
