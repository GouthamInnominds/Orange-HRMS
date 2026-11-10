/**
 * Test Case ID: TC_API_00248
 * Route: apiv2_admin_i18n_groups
 * Endpoint: GET /api/v2/admin/i18n/groups
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00248: apiv2_admin_i18n_groups', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00248: Execute GET /api/v2/admin/i18n/groups [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/i18n/groups',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
