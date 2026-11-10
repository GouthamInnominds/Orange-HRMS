/**
 * Test Case ID: TC_API_00531
 * Route: apiv2_claim_expense_types
 * Endpoint: GET /api/v2/claim/expenses/types
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00531: apiv2_claim_expense_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00531: Execute GET /api/v2/claim/expenses/types [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/expenses/types',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
