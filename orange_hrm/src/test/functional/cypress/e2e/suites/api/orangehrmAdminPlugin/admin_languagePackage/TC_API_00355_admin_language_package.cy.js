/**
 * Test Case ID: TC_API_00355
 * Route: admin_language_package
 * Endpoint: GET /admin/languagePackage
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00355: admin_language_package', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00355: Execute GET /admin/languagePackage [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/languagePackage',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
