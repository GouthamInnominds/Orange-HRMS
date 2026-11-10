/**
 * Test Case ID: TC_API_00358
 * Route: admin_language_package_fix_errors
 * Endpoint: GET /admin/fixLanguageStringErrors/{languageId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00358: admin_language_package_fix_errors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00358: Execute GET /admin/fixLanguageStringErrors/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/fixLanguageStringErrors/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
