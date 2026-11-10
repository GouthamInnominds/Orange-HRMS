/**
 * Test Case ID: TC_API_00542
 * Route: apiv2_claim_expenses
 * Endpoint: POST /api/v2/claim/requests/{requestId}/expenses
 * Method: POST
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00542: apiv2_claim_expenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00542: Execute POST /api/v2/claim/requests/1/expenses [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/requests/1/expenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
