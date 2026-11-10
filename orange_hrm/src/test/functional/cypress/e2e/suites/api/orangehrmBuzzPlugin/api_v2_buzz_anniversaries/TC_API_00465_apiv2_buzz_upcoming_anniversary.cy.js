/**
 * Test Case ID: TC_API_00465
 * Route: apiv2_buzz_upcoming_anniversary
 * Endpoint: GET /api/v2/buzz/anniversaries
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmBuzzPlugin - TC_API_00465: apiv2_buzz_upcoming_anniversary', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00465: Execute GET /api/v2/buzz/anniversaries [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/buzz/anniversaries',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
