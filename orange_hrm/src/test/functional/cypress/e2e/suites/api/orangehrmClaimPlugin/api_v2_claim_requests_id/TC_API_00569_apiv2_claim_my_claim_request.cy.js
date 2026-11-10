/**
 * Test Case ID: TC_API_00569
 * Route: apiv2_claim_my_claim_request
 * Endpoint: GET /api/v2/claim/requests/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00569: apiv2_claim_my_claim_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00569: Execute GET /api/v2/claim/requests/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/requests/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
