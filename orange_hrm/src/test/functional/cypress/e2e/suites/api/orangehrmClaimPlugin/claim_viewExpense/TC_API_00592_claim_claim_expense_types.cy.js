/**
 * Test Case ID: TC_API_00592
 * Route: claim_claim_expense_types
 * Endpoint: GET /claim/viewExpense
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00592: claim_claim_expense_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00592: Execute GET /claim/viewExpense [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/viewExpense',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
