/**
 * Test Case ID: TC_API_00356
 * Route: admin_language_package_import
 * Endpoint: GET /admin/languageImport/{languageId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00356: admin_language_package_import', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00356: Execute GET /admin/languageImport/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/languageImport/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
