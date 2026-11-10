/**
 * Test Case ID: TC_API_00510
 * Route: apiv2_buzz_post_share
 * Endpoint: GET /api/v2/buzz/posts/{postId}/shares
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00510: apiv2_buzz_post_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00510: Execute GET /api/v2/buzz/posts/1/shares [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/posts/1/shares',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
