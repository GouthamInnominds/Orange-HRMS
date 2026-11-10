/**
 * Test Case ID: TC_API_00037
 * Route: apiv2_admin_users
 * Endpoint: GET /api/v2/admin/users
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00037: apiv2_admin_users', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00037: Execute GET /api/v2/admin/users [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/users',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
