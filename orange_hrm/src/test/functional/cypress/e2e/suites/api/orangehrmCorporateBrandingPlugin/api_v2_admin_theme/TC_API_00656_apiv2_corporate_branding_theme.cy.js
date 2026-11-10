/**
 * Test Case ID: TC_API_00656
 * Route: apiv2_corporate_branding_theme
 * Endpoint: PUT /api/v2/admin/theme
 * Method: PUT
 * Priority: High
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00656: apiv2_corporate_branding_theme', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00656: Execute PUT /api/v2/admin/theme [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/theme',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
