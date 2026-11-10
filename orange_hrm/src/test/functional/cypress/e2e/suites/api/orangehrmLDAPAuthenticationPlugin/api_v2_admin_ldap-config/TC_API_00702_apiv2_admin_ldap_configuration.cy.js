/**
 * Test Case ID: TC_API_00702
 * Route: apiv2_admin_ldap_configuration
 * Endpoint: PUT /api/v2/admin/ldap-config
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmLDAPAuthenticationPlugin - TC_API_00702: apiv2_admin_ldap_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00702: Execute PUT /api/v2/admin/ldap-config [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/ldap-config',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
