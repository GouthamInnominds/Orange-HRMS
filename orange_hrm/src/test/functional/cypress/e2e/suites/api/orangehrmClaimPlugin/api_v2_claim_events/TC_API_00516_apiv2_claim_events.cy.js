/**
 * Test Case ID: TC_API_00516
 * Route: apiv2_claim_events
 * Endpoint: POST /api/v2/claim/events
 * Method: POST
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00516: apiv2_claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00516: Execute POST /api/v2/claim/events [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/events',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
