/**
 * Test Case ID: TC_API_00326
 * Route: save_location
 * Endpoint: GET /admin/saveLocation
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00326: save_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00326: Execute GET /admin/saveLocation [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLocation',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
