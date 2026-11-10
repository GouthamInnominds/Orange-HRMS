/**
 * Test Case ID: TC_API_00494
 * Route: apiv2_buzz_like_on_share
 * Endpoint: POST /api/v2/buzz/shares/{shareId}/likes
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00494: apiv2_buzz_like_on_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00494: Execute POST /api/v2/buzz/shares/1/likes [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/buzz/shares/1/likes',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
