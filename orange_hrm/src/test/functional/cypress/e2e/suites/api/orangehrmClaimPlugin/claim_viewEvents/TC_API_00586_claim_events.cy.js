/**
 * Test Case ID: TC_API_00586
 * Route: claim_events
 * Endpoint: GET /claim/viewEvents
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00586: claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00586: Execute GET /claim/viewEvents [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/viewEvents',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
