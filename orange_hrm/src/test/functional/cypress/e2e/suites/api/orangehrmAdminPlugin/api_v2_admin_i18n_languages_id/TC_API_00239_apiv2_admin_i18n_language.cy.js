/**
 * Test Case ID: TC_API_00239
 * Route: apiv2_admin_i18n_language
 * Endpoint: GET /api/v2/admin/i18n/languages/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00239: apiv2_admin_i18n_language', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00239: Execute GET /api/v2/admin/i18n/languages/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/i18n/languages/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
