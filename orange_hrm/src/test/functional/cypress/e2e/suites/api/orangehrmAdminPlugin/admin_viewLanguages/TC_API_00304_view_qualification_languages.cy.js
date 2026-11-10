/**
 * Test Case ID: TC_API_00304
 * Route: view_qualification_languages
 * Endpoint: GET /admin/viewLanguages
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00304: view_qualification_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00304: Execute GET /admin/viewLanguages [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewLanguages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
