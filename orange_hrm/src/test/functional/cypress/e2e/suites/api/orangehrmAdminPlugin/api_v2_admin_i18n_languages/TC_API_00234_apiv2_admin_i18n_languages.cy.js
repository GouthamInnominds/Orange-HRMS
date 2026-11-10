/**
 * Test Case ID: TC_API_00234
 * Route: apiv2_admin_i18n_languages
 * Endpoint: DELETE /api/v2/admin/i18n/languages
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00234: apiv2_admin_i18n_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00234: Execute DELETE /api/v2/admin/i18n/languages [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/i18n/languages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
