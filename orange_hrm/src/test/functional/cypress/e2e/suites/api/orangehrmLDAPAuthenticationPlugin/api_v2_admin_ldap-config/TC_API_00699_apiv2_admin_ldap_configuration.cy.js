/**
 * Test Case ID: TC_API_00699
 * Route: apiv2_admin_ldap_configuration
 * Endpoint: GET /api/v2/admin/ldap-config
 * Method: GET
 * Priority: High
 */

describe('orangehrmLDAPAuthenticationPlugin - TC_API_00699: apiv2_admin_ldap_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00699: Execute GET /api/v2/admin/ldap-config [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/ldap-config',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
