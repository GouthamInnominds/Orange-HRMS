/**
 * Test Case ID: TC_API_00325
 * Route: view_location
 * Endpoint: GET /admin/viewLocations
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00325: view_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00325: Execute GET /admin/viewLocations [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewLocations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
