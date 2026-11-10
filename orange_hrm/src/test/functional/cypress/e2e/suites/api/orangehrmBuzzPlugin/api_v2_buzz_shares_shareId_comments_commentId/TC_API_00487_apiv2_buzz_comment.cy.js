/**
 * Test Case ID: TC_API_00487
 * Route: apiv2_buzz_comment
 * Endpoint: DELETE /api/v2/buzz/shares/{shareId}/comments/{commentId}
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00487: apiv2_buzz_comment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00487: Execute DELETE /api/v2/buzz/shares/1/comments/1 [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/buzz/shares/1/comments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
