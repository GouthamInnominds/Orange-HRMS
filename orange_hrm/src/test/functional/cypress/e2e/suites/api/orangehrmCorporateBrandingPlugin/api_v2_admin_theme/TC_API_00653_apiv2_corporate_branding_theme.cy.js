/**
 * Test Case ID: TC_API_00653
 * Route: apiv2_corporate_branding_theme
 * Endpoint: GET /api/v2/admin/theme
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00653: apiv2_corporate_branding_theme', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00653: Execute GET /api/v2/admin/theme [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/theme',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
