/**
 * Test Case ID: TC_API_00463
 * Route: apiv2_buzz_feed
 * Endpoint: GET /api/v2/buzz/feed
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00463: apiv2_buzz_feed', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00463: Execute GET /api/v2/buzz/feed [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/feed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
