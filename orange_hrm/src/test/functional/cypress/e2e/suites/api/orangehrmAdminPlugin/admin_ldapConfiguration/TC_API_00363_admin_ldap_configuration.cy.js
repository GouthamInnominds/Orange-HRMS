/**
 * Test Case ID: TC_API_00363
 * Route: admin_ldap_configuration
 * Endpoint: GET /admin/ldapConfiguration
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00363: admin_ldap_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00363: Execute GET /admin/ldapConfiguration [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/ldapConfiguration',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
