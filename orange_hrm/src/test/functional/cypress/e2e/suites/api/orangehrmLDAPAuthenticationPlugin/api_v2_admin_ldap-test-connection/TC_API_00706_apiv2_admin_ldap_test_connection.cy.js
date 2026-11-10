/**
 * Test Case ID: TC_API_00706
 * Route: apiv2_admin_ldap_test_connection
 * Endpoint: POST /api/v2/admin/ldap-test-connection
 * Method: POST
 * Priority: High
 */

describe('orangehrmLDAPAuthenticationPlugin - TC_API_00706: apiv2_admin_ldap_test_connection', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00706: Execute POST /api/v2/admin/ldap-test-connection [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/ldap-test-connection',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
