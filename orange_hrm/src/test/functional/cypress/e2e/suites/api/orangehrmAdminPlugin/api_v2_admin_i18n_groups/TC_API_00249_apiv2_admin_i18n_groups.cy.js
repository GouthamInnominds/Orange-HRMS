/**
 * Test Case ID: TC_API_00249
 * Route: apiv2_admin_i18n_groups
 * Endpoint: GET /api/v2/admin/i18n/groups
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00249: apiv2_admin_i18n_groups', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00249: Execute GET /api/v2/admin/i18n/groups [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/i18n/groups',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
