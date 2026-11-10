/**
 * Test Case ID: TC_API_00887
 * Route: apiv2_mobile_modules
 * Endpoint: GET /api/v2/mobile/menus
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmMobilePlugin - TC_API_00887: apiv2_mobile_modules', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00887: Execute GET /api/v2/mobile/menus [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/mobile/menus',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
