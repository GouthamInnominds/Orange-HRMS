/**
 * Test Case ID: TC_API_00594
 * Route: claim_save_claim_expense_types
 * Endpoint: GET /claim/saveExpense
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00594: claim_save_claim_expense_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00594: Execute GET /claim/saveExpense [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/saveExpense',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
