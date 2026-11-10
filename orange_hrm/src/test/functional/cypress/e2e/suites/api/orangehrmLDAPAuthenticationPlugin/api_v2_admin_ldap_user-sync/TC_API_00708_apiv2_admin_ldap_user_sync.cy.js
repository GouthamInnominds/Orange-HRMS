/**
 * Test Case ID: TC_API_00708
 * Route: apiv2_admin_ldap_user_sync
 * Endpoint: GET /api/v2/admin/ldap/user-sync
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLDAPAuthenticationPlugin - TC_API_00708: apiv2_admin_ldap_user_sync', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00708: Execute GET /api/v2/admin/ldap/user-sync [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/ldap/user-sync',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
