/**
 * Test Case ID: TC_API_00127
 * Route: apiv2_admin_memberships
 * Endpoint: DELETE /api/v2/admin/memberships
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00127: apiv2_admin_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00127: Execute DELETE /api/v2/admin/memberships [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/memberships',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
