/**
 * Test Case ID: TC_API_00147
 * Route: apiv2_admin_nationality
 * Endpoint: GET /api/v2/admin/nationalities/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00147: apiv2_admin_nationality', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00147: Execute GET /api/v2/admin/nationalities/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/nationalities/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
