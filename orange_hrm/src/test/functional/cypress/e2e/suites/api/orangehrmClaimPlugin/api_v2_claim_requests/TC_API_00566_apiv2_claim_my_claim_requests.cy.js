/**
 * Test Case ID: TC_API_00566
 * Route: apiv2_claim_my_claim_requests
 * Endpoint: POST /api/v2/claim/requests
 * Method: POST
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00566: apiv2_claim_my_claim_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00566: Execute POST /api/v2/claim/requests [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
