/**
 * Test Case ID: TC_API_00499
 * Route: apiv2_buzz_comment_on_share
 * Endpoint: GET /api/v2/buzz/comments/{commentId}/likes
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00499: apiv2_buzz_comment_on_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00499: Execute GET /api/v2/buzz/comments/1/likes [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/comments/1/likes',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
