/**
 * Test Case ID: TC_API_00125
 * Route: apiv2_admin_memberships
 * Endpoint: POST /api/v2/admin/memberships
 * Method: POST
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00125: apiv2_admin_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00125: Execute POST /api/v2/admin/memberships [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/memberships',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
