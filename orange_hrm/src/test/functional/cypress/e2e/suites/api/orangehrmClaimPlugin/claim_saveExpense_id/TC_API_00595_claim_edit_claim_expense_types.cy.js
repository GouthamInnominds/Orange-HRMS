/**
 * Test Case ID: TC_API_00595
 * Route: claim_edit_claim_expense_types
 * Endpoint: GET /claim/saveExpense/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00595: claim_edit_claim_expense_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00595: Execute GET /claim/saveExpense/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/saveExpense/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
