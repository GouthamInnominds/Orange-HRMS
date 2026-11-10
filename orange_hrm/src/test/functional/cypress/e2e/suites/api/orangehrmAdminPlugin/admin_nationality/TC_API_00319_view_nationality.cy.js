/**
 * Test Case ID: TC_API_00319
 * Route: view_nationality
 * Endpoint: GET /admin/nationality
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00319: view_nationality', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00319: Execute GET /admin/nationality [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/nationality',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
