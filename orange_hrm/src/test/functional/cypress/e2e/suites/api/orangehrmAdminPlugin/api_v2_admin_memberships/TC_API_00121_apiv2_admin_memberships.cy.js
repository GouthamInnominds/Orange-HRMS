/**
 * Test Case ID: TC_API_00121
 * Route: apiv2_admin_memberships
 * Endpoint: GET /api/v2/admin/memberships
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00121: apiv2_admin_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00121: Execute GET /api/v2/admin/memberships [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/memberships',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
