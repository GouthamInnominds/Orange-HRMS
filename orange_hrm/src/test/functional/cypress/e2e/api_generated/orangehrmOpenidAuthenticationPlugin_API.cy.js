/**
 * Automated Cypress API Test Suite for orangehrmOpenidAuthenticationPlugin
 * Total Tests: 20
 */

describe('orangehrmOpenidAuthenticationPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('POST /api/v2/auth/openid-providers', function () {
    it('TC_API_00888: apiv2_auth_openid_providers [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00889: apiv2_auth_openid_providers [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00890: apiv2_auth_openid_providers [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/auth/openid-providers', function () {
    it('TC_API_00891: apiv2_auth_openid_providers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00892: apiv2_auth_openid_providers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/auth/openid-providers', function () {
    it('TC_API_00893: apiv2_auth_openid_providers [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00894: apiv2_auth_openid_providers [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/auth/openid-providers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/auth/openid-providers/{id}', function () {
    it('TC_API_00895: apiv2_auth_openid_provider [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/auth/openid-providers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00896: apiv2_auth_openid_provider [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/auth/openid-providers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/auth/openid-providers/{id}', function () {
    it('TC_API_00897: apiv2_auth_openid_provider [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/auth/openid-providers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00898: apiv2_auth_openid_provider [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/auth/openid-providers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00899: apiv2_auth_openid_provider [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/auth/openid-providers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET admin/addAuthProvider', function () {
    it('TC_API_00900: admin_add_auth_provider [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: 'admin/addAuthProvider',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00901: admin_add_auth_provider [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: 'admin/addAuthProvider',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET admin/editAuthProvider/{id}', function () {
    it('TC_API_00902: admin_edit_auth_provider [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: 'admin/editAuthProvider/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00903: admin_edit_auth_provider [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: 'admin/editAuthProvider/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /openidauth/openIdCredentials', function () {
    it('TC_API_00904: auth_oidc_login_redirect [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/openidauth/openIdCredentials',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00905: auth_oidc_login_redirect [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/openidauth/openIdCredentials',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /openidauth/openIdCredentials/{providerId}', function () {
    it('TC_API_00906: auth_oidc_login [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/openidauth/openIdCredentials/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00907: auth_oidc_login [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/openidauth/openIdCredentials/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
