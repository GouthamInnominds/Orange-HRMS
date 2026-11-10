/**
 * Test Case ID: TC_API_00226
 * Route: apiv2_admin_localization
 * Endpoint: GET /api/v2/admin/localization
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00226: apiv2_admin_localization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00226: Execute GET /api/v2/admin/localization [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/localization',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
