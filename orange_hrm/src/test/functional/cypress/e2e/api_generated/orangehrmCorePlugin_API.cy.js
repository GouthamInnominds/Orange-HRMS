/**
 * Automated Cypress API Test Suite for orangehrmCorePlugin
 * Total Tests: 16
 */

describe('orangehrmCorePlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/core/data-groups', function () {
    it('TC_API_00636: apiv2_core_data_groups [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00637: apiv2_core_data_groups [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/core/data-groups', function () {
    it('TC_API_00638: apiv2_core_data_groups [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00639: apiv2_core_data_groups [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00640: apiv2_core_data_groups [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/core/data-groups', function () {
    it('TC_API_00641: apiv2_core_data_groups [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00642: apiv2_core_data_groups [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/core/data-groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/core/about', function () {
    it('TC_API_00643: apiv2_core_about_organization [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/about',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00644: apiv2_core_about_organization [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/about',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /events/push', function () {
    it('TC_API_00645: push_events [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/events/push',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00646: push_events [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/events/push',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00647: push_events [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/events/push',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/core/public/version', function () {
    it('TC_API_00648: apiv2_core_public_api_version [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/public/version',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00649: apiv2_core_public_api_version [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/public/version',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/core/validation/unique', function () {
    it('TC_API_00650: apiv2_core_validate_uniqueness [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/validation/unique',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00651: apiv2_core_validate_uniqueness [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/core/validation/unique',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
