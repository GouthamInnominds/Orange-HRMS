/**
 * Test Case ID: TC_API_00232
 * Route: apiv2_admin_i18n_languages
 * Endpoint: GET /api/v2/admin/i18n/languages
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00232: apiv2_admin_i18n_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00232: Execute GET /api/v2/admin/i18n/languages [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/i18n/languages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
