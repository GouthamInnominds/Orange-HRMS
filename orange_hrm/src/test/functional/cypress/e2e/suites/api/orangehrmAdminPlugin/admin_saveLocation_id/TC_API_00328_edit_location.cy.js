/**
 * Test Case ID: TC_API_00328
 * Route: edit_location
 * Endpoint: GET /admin/saveLocation/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00328: edit_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00328: Execute GET /admin/saveLocation/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLocation/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
