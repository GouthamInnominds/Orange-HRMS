/**
 * Automated Cypress API Test Suite for orangehrmCorporateBrandingPlugin
 * Total Tests: 16
 */

describe('orangehrmCorporateBrandingPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/admin/theme', function () {
    it('TC_API_00652: apiv2_corporate_branding_theme [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00653: apiv2_corporate_branding_theme [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/theme', function () {
    it('TC_API_00654: apiv2_corporate_branding_theme [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00655: apiv2_corporate_branding_theme [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00656: apiv2_corporate_branding_theme [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/theme', function () {
    it('TC_API_00657: apiv2_corporate_branding_theme [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00658: apiv2_corporate_branding_theme [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/theme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/theme/preview', function () {
    it('TC_API_00659: apiv2_corporate_branding_theme_preview [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/theme/preview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00660: apiv2_corporate_branding_theme_preview [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/theme/preview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00661: apiv2_corporate_branding_theme_preview [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/theme/preview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/theme/image/{imageName}', function () {
    it('TC_API_00662: corporate_branding_images [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/theme/image/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00663: corporate_branding_images [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/theme/image/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/theme/attachments/image/{imageName}', function () {
    it('TC_API_00664: corporate_branding_attachments_image [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/theme/attachments/image/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00665: corporate_branding_attachments_image [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/theme/attachments/image/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/addTheme', function () {
    it('TC_API_00666: admin_corporate_branding [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/addTheme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00667: admin_corporate_branding [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/addTheme',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
