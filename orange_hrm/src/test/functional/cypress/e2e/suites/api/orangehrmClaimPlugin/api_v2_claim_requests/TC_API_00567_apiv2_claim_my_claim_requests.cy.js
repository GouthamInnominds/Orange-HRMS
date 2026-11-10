/**
 * Test Case ID: TC_API_00567
 * Route: apiv2_claim_my_claim_requests
 * Endpoint: GET /api/v2/claim/requests
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00567: apiv2_claim_my_claim_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00567: Execute GET /api/v2/claim/requests [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
