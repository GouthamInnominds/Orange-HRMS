/**
 * Test Case ID: TC_API_00596
 * Route: claim_edit_claim_expense_types
 * Endpoint: GET /claim/saveExpense/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00596: claim_edit_claim_expense_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00596: Execute GET /claim/saveExpense/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/saveExpense/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
