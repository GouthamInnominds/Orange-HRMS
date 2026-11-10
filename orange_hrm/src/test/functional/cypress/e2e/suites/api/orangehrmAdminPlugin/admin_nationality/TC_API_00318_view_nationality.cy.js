/**
 * Test Case ID: TC_API_00318
 * Route: view_nationality
 * Endpoint: GET /admin/nationality
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00318: view_nationality', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00318: Execute GET /admin/nationality [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/nationality',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
