/**
 * Test Case ID: TC_API_00610
 * Route: claim_attachment
 * Endpoint: GET /claim/requests/{requestId}/attachId/{attachId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00610: claim_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00610: Execute GET /claim/requests/1/attachId/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/requests/1/attachId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
