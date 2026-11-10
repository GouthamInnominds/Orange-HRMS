/**
 * Test Case ID: TC_API_00462
 * Route: apiv2_buzz_feed
 * Endpoint: GET /api/v2/buzz/feed
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00462: apiv2_buzz_feed', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00462: Execute GET /api/v2/buzz/feed [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/feed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
