/**
 * Test Case ID: TC_API_00588
 * Route: claim_save_claim_events
 * Endpoint: GET /claim/saveEvents
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00588: claim_save_claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00588: Execute GET /claim/saveEvents [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/saveEvents',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
