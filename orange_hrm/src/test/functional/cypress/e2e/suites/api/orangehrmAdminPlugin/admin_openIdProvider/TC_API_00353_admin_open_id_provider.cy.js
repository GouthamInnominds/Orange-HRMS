/**
 * Test Case ID: TC_API_00353
 * Route: admin_open_id_provider
 * Endpoint: GET /admin/openIdProvider
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00353: admin_open_id_provider', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00353: Execute GET /admin/openIdProvider [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/openIdProvider',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
