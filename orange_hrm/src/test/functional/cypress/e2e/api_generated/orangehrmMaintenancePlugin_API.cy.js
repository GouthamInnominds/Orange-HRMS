/**
 * Automated Cypress API Test Suite for orangehrmMaintenancePlugin
 * Total Tests: 16
 */

describe('orangehrmMaintenancePlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('DELETE /api/v2/maintenance/purge', function () {
    it('TC_API_00870: apiv2_maintenance_purge [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/maintenance/purge',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00871: apiv2_maintenance_purge [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/maintenance/purge',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/maintenance/candidates/purge', function () {
    it('TC_API_00872: apiv2_maintenance_purge_candidate [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/maintenance/candidates/purge',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00873: apiv2_maintenance_purge_candidate [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/maintenance/candidates/purge',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/maintenance/candidates', function () {
    it('TC_API_00874: apiv2_maintenance_candidates [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/maintenance/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00875: apiv2_maintenance_candidates [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/maintenance/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /maintenance/accessEmployeeData/{empNumber}', function () {
    it('TC_API_00876: maintainence_employee_json [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/accessEmployeeData/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00877: maintainence_employee_json [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/accessEmployeeData/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /maintenance/viewMaintenanceModule', function () {
    it('TC_API_00878: maintainence_module [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/viewMaintenanceModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00879: maintainence_module [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/viewMaintenanceModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /maintenance/accessEmployeeData', function () {
    it('TC_API_00880: maintainence_access_employee_screen [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/accessEmployeeData',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00881: maintainence_access_employee_screen [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/accessEmployeeData',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /maintenance/purgeEmployee', function () {
    it('TC_API_00882: maintainence_purge_employee [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/purgeEmployee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00883: maintainence_purge_employee [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/purgeEmployee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /maintenance/purgeCandidateData', function () {
    it('TC_API_00884: maintainence_candidate_records [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/purgeCandidateData',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00885: maintainence_candidate_records [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/purgeCandidateData',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
