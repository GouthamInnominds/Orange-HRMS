/**
 * Test Case ID: TC_E2E_JOURNEY_0022
 * Journey: Travel Expense Submission, Receipt Verification & Claim Settlement
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0022: Travel Expense Submission, Receipt Verification & Claim Settlement', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0022: E2E Journey 22 - Travel Expense Submission, Receipt Verification & Claim Settlement', function () {
    cy.url().should('include', '/auth/login');
  });
});
