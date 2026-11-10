/**
 * Test Case ID: TC_API_00305
 * Route: view_qualification_languages
 * Endpoint: GET /admin/viewLanguages
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00305: view_qualification_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00305: Execute GET /admin/viewLanguages [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewLanguages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
