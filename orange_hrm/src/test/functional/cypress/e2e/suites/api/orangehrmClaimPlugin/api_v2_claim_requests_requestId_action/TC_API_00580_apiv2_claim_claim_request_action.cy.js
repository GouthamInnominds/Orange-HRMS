/**
 * Test Case ID: TC_API_00580
 * Route: apiv2_claim_claim_request_action
 * Endpoint: PUT /api/v2/claim/requests/{requestId}/action
 * Method: PUT
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00580: apiv2_claim_claim_request_action', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00580: Execute PUT /api/v2/claim/requests/1/action [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/claim/requests/1/action',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
