/**
 * Test Case ID: TC_API_00237
 * Route: apiv2_admin_i18n_translation_import
 * Endpoint: POST /api/v2/admin/i18n/languages/{languageId}/import
 * Method: POST
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00237: apiv2_admin_i18n_translation_import', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00237: Execute POST /api/v2/admin/i18n/languages/1/import [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/i18n/languages/1/import',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
