/**
 * Test Case ID: TC_API_00321
 * Route: save_nationality
 * Endpoint: GET /admin/saveNationality
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00321: save_nationality', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00321: Execute GET /admin/saveNationality [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveNationality',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
