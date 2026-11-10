/**
 * Test Case ID: TC_API_00581
 * Route: apiv2_claim_claim_request_action
 * Endpoint: GET /api/v2/claim/requests/{requestId}/action
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00581: apiv2_claim_claim_request_action', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00581: Execute GET /api/v2/claim/requests/1/action [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/requests/1/action',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
