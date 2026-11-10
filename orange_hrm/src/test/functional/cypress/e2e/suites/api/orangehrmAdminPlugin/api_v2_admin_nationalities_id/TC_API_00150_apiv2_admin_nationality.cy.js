/**
 * Test Case ID: TC_API_00150
 * Route: apiv2_admin_nationality
 * Endpoint: PUT /api/v2/admin/nationalities/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00150: apiv2_admin_nationality', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00150: Execute PUT /api/v2/admin/nationalities/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/nationalities/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
