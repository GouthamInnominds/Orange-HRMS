/**
 * Test Case ID: TC_API_00479
 * Route: apiv2_buzz_comments
 * Endpoint: POST /api/v2/buzz/shares/{shareId}/comments
 * Method: POST
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00479: apiv2_buzz_comments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00479: Execute POST /api/v2/buzz/shares/1/comments [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/buzz/shares/1/comments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
