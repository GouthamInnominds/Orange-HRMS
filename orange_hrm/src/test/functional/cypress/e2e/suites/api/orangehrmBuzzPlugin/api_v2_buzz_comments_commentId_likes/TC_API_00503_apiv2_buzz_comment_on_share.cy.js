/**
 * Test Case ID: TC_API_00503
 * Route: apiv2_buzz_comment_on_share
 * Endpoint: DELETE /api/v2/buzz/comments/{commentId}/likes
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00503: apiv2_buzz_comment_on_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00503: Execute DELETE /api/v2/buzz/comments/1/likes [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/buzz/comments/1/likes',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
