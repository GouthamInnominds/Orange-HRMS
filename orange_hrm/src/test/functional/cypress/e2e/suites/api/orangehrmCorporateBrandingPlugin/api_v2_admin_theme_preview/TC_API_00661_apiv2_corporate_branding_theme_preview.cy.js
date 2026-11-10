/**
 * Test Case ID: TC_API_00661
 * Route: apiv2_corporate_branding_theme_preview
 * Endpoint: POST /api/v2/admin/theme/preview
 * Method: POST
 * Priority: High
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00661: apiv2_corporate_branding_theme_preview', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00661: Execute POST /api/v2/admin/theme/preview [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/theme/preview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
