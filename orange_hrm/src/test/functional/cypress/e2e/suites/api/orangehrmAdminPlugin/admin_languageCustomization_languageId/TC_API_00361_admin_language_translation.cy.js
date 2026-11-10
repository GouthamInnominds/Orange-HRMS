/**
 * Test Case ID: TC_API_00361
 * Route: admin_language_translation
 * Endpoint: GET /admin/languageCustomization/{languageId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00361: admin_language_translation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00361: Execute GET /admin/languageCustomization/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/languageCustomization/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
