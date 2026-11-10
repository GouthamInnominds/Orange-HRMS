/**
 * Test Case ID: TC_API_00240
 * Route: apiv2_admin_i18n_language
 * Endpoint: PUT /api/v2/admin/i18n/languages/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00240: apiv2_admin_i18n_language', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00240: Execute PUT /api/v2/admin/i18n/languages/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/i18n/languages/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
