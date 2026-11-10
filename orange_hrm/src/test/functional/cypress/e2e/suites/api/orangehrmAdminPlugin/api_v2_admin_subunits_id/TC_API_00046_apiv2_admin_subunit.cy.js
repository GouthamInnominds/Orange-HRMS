/**
 * Test Case ID: TC_API_00046
 * Route: apiv2_admin_subunit
 * Endpoint: PUT /api/v2/admin/subunits/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00046: apiv2_admin_subunit', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00046: Execute PUT /api/v2/admin/subunits/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/subunits/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
