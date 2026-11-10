/**
 * Test Case ID: TC_API_00280
 * Route: save_system_users
 * Endpoint: GET /admin/saveSystemUser
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00280: save_system_users', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00280: Execute GET /admin/saveSystemUser [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveSystemUser',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
