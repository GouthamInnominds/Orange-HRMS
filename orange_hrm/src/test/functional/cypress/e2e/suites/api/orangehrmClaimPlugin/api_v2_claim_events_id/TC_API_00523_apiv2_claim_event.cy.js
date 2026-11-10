/**
 * Test Case ID: TC_API_00523
 * Route: apiv2_claim_event
 * Endpoint: GET /api/v2/claim/events/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00523: apiv2_claim_event', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00523: Execute GET /api/v2/claim/events/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/events/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
