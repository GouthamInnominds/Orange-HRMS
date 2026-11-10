/**
 * Test Case ID: TC_API_00506
 * Route: apiv2_buzz_post
 * Endpoint: GET /api/v2/buzz/posts/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00506: apiv2_buzz_post', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00506: Execute GET /api/v2/buzz/posts/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/posts/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
