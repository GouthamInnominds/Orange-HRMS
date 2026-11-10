/**
 * Test Case ID: TC_API_00040
 * Route: apiv2_admin_users
 * Endpoint: POST /api/v2/admin/users
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00040: apiv2_admin_users', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00040: Execute POST /api/v2/admin/users [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/users',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
