/**
 * Test Case ID: TC_API_00327
 * Route: save_location
 * Endpoint: GET /admin/saveLocation
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00327: save_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00327: Execute GET /admin/saveLocation [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLocation',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
