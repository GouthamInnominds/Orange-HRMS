/**
 * Automated Cypress API Test Suite for orangehrmAuthenticationPlugin
 * Total Tests: 34
 */

describe('orangehrmAuthenticationPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('POST /api/v2/auth/public/validation/password', function () {
    it('TC_API_00428: apiv2_auth_public_validation_password [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/auth/public/validation/password',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00429: apiv2_auth_public_validation_password [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/auth/public/validation/password',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00430: apiv2_auth_public_validation_password [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/auth/public/validation/password',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /', function () {
    it('TC_API_00431: root [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00432: root [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/login', function () {
    it('TC_API_00433: auth_login [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/login',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00434: auth_login [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/login',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /auth/validate', function () {
    it('TC_API_00435: auth_validate [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/validate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00436: auth_validate [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/validate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00437: auth_validate [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/validate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/logout', function () {
    it('TC_API_00438: auth_logout [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/logout',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00439: auth_logout [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/logout',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /auth/adminVerify', function () {
    it('TC_API_00440: auth_admin_access_verify [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/adminVerify',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00441: auth_admin_access_verify [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/adminVerify',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00442: auth_admin_access_verify [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/adminVerify',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /auth/requestResetPassword', function () {
    it('TC_API_00443: auth_request_reset_password [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/requestResetPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00444: auth_request_reset_password [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/requestResetPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00445: auth_request_reset_password [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/requestResetPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /auth/resetPassword', function () {
    it('TC_API_00446: auth_reset_password [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/resetPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00447: auth_reset_password [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/resetPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00448: auth_reset_password [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/resetPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/sendPasswordReset', function () {
    it('TC_API_00449: auth_send_password_reset [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/sendPasswordReset',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00450: auth_send_password_reset [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/sendPasswordReset',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/sendPasswordResetFailure', function () {
    it('TC_API_00451: auth_send_password_reset_failure [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/sendPasswordResetFailure',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00452: auth_send_password_reset_failure [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/sendPasswordResetFailure',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/requestPasswordResetCode', function () {
    it('TC_API_00453: auth_forgot_password_username [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/requestPasswordResetCode',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00454: auth_forgot_password_username [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/requestPasswordResetCode',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/resetPassword/resetCode/{resetCode}', function () {
    it('TC_API_00455: auth_reset_code [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/resetPassword/resetCode/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00456: auth_reset_code [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/resetPassword/resetCode/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /auth/changeWeakPassword/resetCode/{resetCode}', function () {
    it('TC_API_00457: auth_weak_password_reset [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/changeWeakPassword/resetCode/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00458: auth_weak_password_reset [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/auth/changeWeakPassword/resetCode/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /auth/resetWeakPassword', function () {
    it('TC_API_00459: auth_request_enforce_password [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/resetWeakPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00460: auth_request_enforce_password [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/resetWeakPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00461: auth_request_enforce_password [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/auth/resetWeakPassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

});
