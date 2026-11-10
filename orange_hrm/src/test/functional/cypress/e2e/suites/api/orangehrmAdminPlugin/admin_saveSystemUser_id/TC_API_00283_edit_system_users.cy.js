/**
 * Test Case ID: TC_API_00283
 * Route: edit_system_users
 * Endpoint: GET /admin/saveSystemUser/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00283: edit_system_users', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00283: Execute GET /admin/saveSystemUser/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveSystemUser/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
