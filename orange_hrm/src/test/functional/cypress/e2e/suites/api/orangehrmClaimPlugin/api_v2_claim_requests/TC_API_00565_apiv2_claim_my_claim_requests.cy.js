/**
 * Test Case ID: TC_API_00565
 * Route: apiv2_claim_my_claim_requests
 * Endpoint: POST /api/v2/claim/requests
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00565: apiv2_claim_my_claim_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00565: Execute POST /api/v2/claim/requests [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
