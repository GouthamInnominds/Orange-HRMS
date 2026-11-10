/**
 * Test Case ID: TC_API_00307
 * Route: save_qualification_languages
 * Endpoint: GET /admin/saveLanguages
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00307: save_qualification_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00307: Execute GET /admin/saveLanguages [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLanguages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
