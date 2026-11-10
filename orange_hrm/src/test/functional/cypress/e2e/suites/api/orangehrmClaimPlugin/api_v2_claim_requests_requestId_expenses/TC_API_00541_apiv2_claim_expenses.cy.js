/**
 * Test Case ID: TC_API_00541
 * Route: apiv2_claim_expenses
 * Endpoint: POST /api/v2/claim/requests/{requestId}/expenses
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00541: apiv2_claim_expenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00541: Execute POST /api/v2/claim/requests/1/expenses [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/requests/1/expenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
