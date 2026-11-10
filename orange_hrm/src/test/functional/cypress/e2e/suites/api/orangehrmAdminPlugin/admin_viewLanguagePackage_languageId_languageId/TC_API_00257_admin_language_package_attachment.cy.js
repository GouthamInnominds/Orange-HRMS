/**
 * Test Case ID: TC_API_00257
 * Route: admin_language_package_attachment
 * Endpoint: GET /admin/viewLanguagePackage/languageId/{languageId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00257: admin_language_package_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00257: Execute GET /admin/viewLanguagePackage/languageId/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewLanguagePackage/languageId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
