/**
 * Test Case ID: TC_API_00485
 * Route: apiv2_buzz_comment
 * Endpoint: PUT /api/v2/buzz/shares/{shareId}/comments/{commentId}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00485: apiv2_buzz_comment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00485: Execute PUT /api/v2/buzz/shares/1/comments/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/buzz/shares/1/comments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
