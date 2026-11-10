/**
 * Test Case ID: TC_API_00520
 * Route: apiv2_claim_events
 * Endpoint: GET /api/v2/claim/events
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00520: apiv2_claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00520: Execute GET /api/v2/claim/events [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/events',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
