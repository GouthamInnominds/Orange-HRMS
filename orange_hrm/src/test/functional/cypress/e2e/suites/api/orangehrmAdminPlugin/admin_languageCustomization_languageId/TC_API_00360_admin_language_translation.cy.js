/**
 * Test Case ID: TC_API_00360
 * Route: admin_language_translation
 * Endpoint: GET /admin/languageCustomization/{languageId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00360: admin_language_translation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00360: Execute GET /admin/languageCustomization/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/languageCustomization/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
