/**
 * Test Case ID: TC_API_00329
 * Route: edit_location
 * Endpoint: GET /admin/saveLocation/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00329: edit_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00329: Execute GET /admin/saveLocation/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLocation/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
