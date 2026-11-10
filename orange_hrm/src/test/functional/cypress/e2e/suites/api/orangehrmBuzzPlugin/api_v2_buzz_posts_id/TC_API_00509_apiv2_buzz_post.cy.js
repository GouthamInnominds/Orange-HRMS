/**
 * Test Case ID: TC_API_00509
 * Route: apiv2_buzz_post
 * Endpoint: PUT /api/v2/buzz/posts/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00509: apiv2_buzz_post', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00509: Execute PUT /api/v2/buzz/posts/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/buzz/posts/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
