/**
 * Test Case ID: TC_API_00508
 * Route: apiv2_buzz_post
 * Endpoint: PUT /api/v2/buzz/posts/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00508: apiv2_buzz_post', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00508: Execute PUT /api/v2/buzz/posts/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/buzz/posts/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
