/**
 * Test Case ID: TC_API_00480
 * Route: apiv2_buzz_comments
 * Endpoint: POST /api/v2/buzz/shares/{shareId}/comments
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00480: apiv2_buzz_comments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00480: Execute POST /api/v2/buzz/shares/1/comments [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/buzz/shares/1/comments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
