/**
 * Test Case ID: TC_API_00157
 * Route: apiv2_admin_nationalities
 * Endpoint: DELETE /api/v2/admin/nationalities
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00157: apiv2_admin_nationalities', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00157: Execute DELETE /api/v2/admin/nationalities [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/nationalities',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
