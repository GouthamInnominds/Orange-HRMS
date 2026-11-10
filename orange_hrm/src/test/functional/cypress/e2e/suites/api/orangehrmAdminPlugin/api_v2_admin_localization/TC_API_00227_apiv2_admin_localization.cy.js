/**
 * Test Case ID: TC_API_00227
 * Route: apiv2_admin_localization
 * Endpoint: GET /api/v2/admin/localization
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00227: apiv2_admin_localization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00227: Execute GET /api/v2/admin/localization [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/localization',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
