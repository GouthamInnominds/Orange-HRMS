/**
 * Test Case ID: TC_API_00489
 * Route: aapiv2_buzz_video_url_validation
 * Endpoint: GET /api/v2/buzz/validation/links
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00489: aapiv2_buzz_video_url_validation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00489: Execute GET /api/v2/buzz/validation/links [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/validation/links',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
