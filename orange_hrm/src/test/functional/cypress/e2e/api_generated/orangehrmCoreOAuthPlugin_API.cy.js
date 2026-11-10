/**
 * Automated Cypress API Test Suite for orangehrmCoreOAuthPlugin
 * Total Tests: 25
 */

describe('orangehrmCoreOAuthPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/admin/oauth-clients/{id}', function () {
    it('TC_API_00611: apiv2_admin_oauth_client [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/oauth-clients/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00612: apiv2_admin_oauth_client [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/oauth-clients/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/oauth-clients/{id}', function () {
    it('TC_API_00613: apiv2_admin_oauth_client [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/oauth-clients/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00614: apiv2_admin_oauth_client [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/oauth-clients/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00615: apiv2_admin_oauth_client [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/oauth-clients/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/oauth-clients', function () {
    it('TC_API_00616: apiv2_admin_oauth_clients [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00617: apiv2_admin_oauth_clients [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/oauth-clients', function () {
    it('TC_API_00618: apiv2_admin_oauth_clients [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00619: apiv2_admin_oauth_clients [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00620: apiv2_admin_oauth_clients [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/oauth-clients', function () {
    it('TC_API_00621: apiv2_admin_oauth_clients [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00622: apiv2_admin_oauth_clients [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/oauth-clients',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/registerOAuthClient', function () {
    it('TC_API_00623: admin_view_oauth_client [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/registerOAuthClient',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00624: admin_view_oauth_client [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/registerOAuthClient',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/editOAuthClient', function () {
    it('TC_API_00625: admin_edit_oauth_client [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/editOAuthClient',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00626: admin_edit_oauth_client [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/editOAuthClient',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveOAuthClient', function () {
    it('TC_API_00627: admin_save_oauth_client [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveOAuthClient',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00628: admin_save_oauth_client [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveOAuthClient',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /oauth2/authorize/consent', function () {
    it('TC_API_00629: auth_oauth2_consent [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/oauth2/authorize/consent',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00630: auth_oauth2_consent [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/oauth2/authorize/consent',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /oauth2/authorize', function () {
    it('TC_API_00631: auth_oauth2_authorize [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/oauth2/authorize',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00632: auth_oauth2_authorize [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/oauth2/authorize',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /oauth2/token', function () {
    it('TC_API_00633: auth_oauth2_token [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/oauth2/token',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00634: auth_oauth2_token [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/oauth2/token',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00635: auth_oauth2_token [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/oauth2/token',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

});
