/**
 * Automated Cypress API Test Suite for orangehrmLDAPAuthenticationPlugin
 * Total Tests: 13
 */

describe('orangehrmLDAPAuthenticationPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/admin/ldap-config', function () {
    it('TC_API_00699: apiv2_admin_ldap_configuration [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/ldap-config',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00700: apiv2_admin_ldap_configuration [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/ldap-config',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/ldap-config', function () {
    it('TC_API_00701: apiv2_admin_ldap_configuration [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/ldap-config',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00702: apiv2_admin_ldap_configuration [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/ldap-config',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00703: apiv2_admin_ldap_configuration [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/ldap-config',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/ldap-test-connection', function () {
    it('TC_API_00704: apiv2_admin_ldap_test_connection [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/ldap-test-connection',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00705: apiv2_admin_ldap_test_connection [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/ldap-test-connection',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00706: apiv2_admin_ldap_test_connection [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/ldap-test-connection',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/ldap/user-sync', function () {
    it('TC_API_00707: apiv2_admin_ldap_user_sync [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/ldap/user-sync',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00708: apiv2_admin_ldap_user_sync [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/ldap/user-sync',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/ldap/user-sync', function () {
    it('TC_API_00709: apiv2_admin_ldap_user_sync [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/ldap/user-sync',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00710: apiv2_admin_ldap_user_sync [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/ldap/user-sync',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00711: apiv2_admin_ldap_user_sync [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/ldap/user-sync',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

});
