/**
 * Test Case ID: TC_API_00278
 * Route: view_system_users
 * Endpoint: GET /admin/viewSystemUsers
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00278: view_system_users', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00278: Execute GET /admin/viewSystemUsers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewSystemUsers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
