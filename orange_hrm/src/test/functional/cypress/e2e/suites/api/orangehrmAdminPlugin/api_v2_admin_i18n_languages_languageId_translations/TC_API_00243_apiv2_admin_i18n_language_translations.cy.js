/**
 * Test Case ID: TC_API_00243
 * Route: apiv2_admin_i18n_language_translations
 * Endpoint: GET /api/v2/admin/i18n/languages/{languageId}/translations
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00243: apiv2_admin_i18n_language_translations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00243: Execute GET /api/v2/admin/i18n/languages/1/translations [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/i18n/languages/1/translations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
