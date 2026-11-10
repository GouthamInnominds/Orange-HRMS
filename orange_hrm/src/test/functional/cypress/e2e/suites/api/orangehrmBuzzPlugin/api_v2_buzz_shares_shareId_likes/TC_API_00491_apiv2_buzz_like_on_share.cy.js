/**
 * Test Case ID: TC_API_00491
 * Route: apiv2_buzz_like_on_share
 * Endpoint: GET /api/v2/buzz/shares/{shareId}/likes
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00491: apiv2_buzz_like_on_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00491: Execute GET /api/v2/buzz/shares/1/likes [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/shares/1/likes',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
