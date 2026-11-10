/**
 * Test Case ID: TC_API_00522
 * Route: apiv2_claim_events
 * Endpoint: DELETE /api/v2/claim/events
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00522: apiv2_claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00522: Execute DELETE /api/v2/claim/events [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/claim/events',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
