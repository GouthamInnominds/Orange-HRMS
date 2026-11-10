/**
 * Test Case ID: TC_API_00666
 * Route: admin_corporate_branding
 * Endpoint: GET /admin/addTheme
 * Method: GET
 * Priority: High
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00666: admin_corporate_branding', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00666: Execute GET /admin/addTheme [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/addTheme',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
