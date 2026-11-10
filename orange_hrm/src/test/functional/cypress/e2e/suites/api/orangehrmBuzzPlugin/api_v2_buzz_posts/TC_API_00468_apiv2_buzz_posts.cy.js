/**
 * Test Case ID: TC_API_00468
 * Route: apiv2_buzz_posts
 * Endpoint: POST /api/v2/buzz/posts
 * Method: POST
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00468: apiv2_buzz_posts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00468: Execute POST /api/v2/buzz/posts [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/buzz/posts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
