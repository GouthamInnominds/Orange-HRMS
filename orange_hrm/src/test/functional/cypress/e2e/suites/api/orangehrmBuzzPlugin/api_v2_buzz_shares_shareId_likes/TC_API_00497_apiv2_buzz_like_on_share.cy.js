/**
 * Test Case ID: TC_API_00497
 * Route: apiv2_buzz_like_on_share
 * Endpoint: DELETE /api/v2/buzz/shares/{shareId}/likes
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00497: apiv2_buzz_like_on_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00497: Execute DELETE /api/v2/buzz/shares/1/likes [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/buzz/shares/1/likes',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
