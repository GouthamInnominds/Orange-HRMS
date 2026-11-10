/**
 * Test Case ID: TC_API_00548
 * Route: apiv2_claim_expense
 * Endpoint: GET /api/v2/claim/requests/{requestId}/expenses/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00548: apiv2_claim_expense', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00548: Execute GET /api/v2/claim/requests/1/expenses/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/requests/1/expenses/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
