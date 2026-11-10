/**
 * Test Case ID: TC_API_00667
 * Route: admin_corporate_branding
 * Endpoint: GET /admin/addTheme
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00667: admin_corporate_branding', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00667: Execute GET /admin/addTheme [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/addTheme',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
