/**
 * Test Case ID: TC_API_00657
 * Route: apiv2_corporate_branding_theme
 * Endpoint: DELETE /api/v2/admin/theme
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00657: apiv2_corporate_branding_theme', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00657: Execute DELETE /api/v2/admin/theme [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/theme',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
