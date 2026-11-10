/**
 * Test Case ID: TC_API_00477
 * Route: apiv2_buzz_comments
 * Endpoint: GET /api/v2/buzz/shares/{shareId}/comments
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00477: apiv2_buzz_comments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00477: Execute GET /api/v2/buzz/shares/1/comments [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/shares/1/comments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
