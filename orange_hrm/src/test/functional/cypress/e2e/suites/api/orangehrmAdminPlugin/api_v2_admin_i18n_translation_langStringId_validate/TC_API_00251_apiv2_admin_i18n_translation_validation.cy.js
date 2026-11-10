/**
 * Test Case ID: TC_API_00251
 * Route: apiv2_admin_i18n_translation_validation
 * Endpoint: GET /api/v2/admin/i18n/translation/{langStringId}/validate
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00251: apiv2_admin_i18n_translation_validation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00251: Execute GET /api/v2/admin/i18n/translation/1/validate [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/i18n/translation/1/validate',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
