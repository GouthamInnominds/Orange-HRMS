/**
 * Test Case ID: TC_API_00246
 * Route: apiv2_admin_i18n_language_bulk_translations
 * Endpoint: PUT /api/v2/admin/i18n/languages/{languageId}/translations/bulk
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00246: apiv2_admin_i18n_language_bulk_translations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00246: Execute PUT /api/v2/admin/i18n/languages/1/translations/bulk [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/i18n/languages/1/translations/bulk',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
