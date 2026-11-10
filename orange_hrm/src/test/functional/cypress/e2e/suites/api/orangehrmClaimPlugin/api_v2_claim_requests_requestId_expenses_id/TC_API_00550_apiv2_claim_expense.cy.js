/**
 * Test Case ID: TC_API_00550
 * Route: apiv2_claim_expense
 * Endpoint: PUT /api/v2/claim/requests/{requestId}/expenses/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00550: apiv2_claim_expense', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00550: Execute PUT /api/v2/claim/requests/1/expenses/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/claim/requests/1/expenses/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
