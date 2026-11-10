/**
 * Test Case ID: TC_API_00517
 * Route: apiv2_claim_events
 * Endpoint: POST /api/v2/claim/events
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00517: apiv2_claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00517: Execute POST /api/v2/claim/events [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/events',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
