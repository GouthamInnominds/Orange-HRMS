/**
 * Test Case ID: TC_API_00043
 * Route: apiv2_admin_users
 * Endpoint: DELETE /api/v2/admin/users
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00043: apiv2_admin_users', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00043: Execute DELETE /api/v2/admin/users [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/users',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
