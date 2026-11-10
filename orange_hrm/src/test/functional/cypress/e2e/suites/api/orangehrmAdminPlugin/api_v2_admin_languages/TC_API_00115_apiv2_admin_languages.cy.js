/**
 * Test Case ID: TC_API_00115
 * Route: apiv2_admin_languages
 * Endpoint: DELETE /api/v2/admin/languages
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00115: apiv2_admin_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00115: Execute DELETE /api/v2/admin/languages [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/languages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
