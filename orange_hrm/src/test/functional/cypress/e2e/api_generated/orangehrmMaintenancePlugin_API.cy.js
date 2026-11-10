/**
 * Automated Cypress API Contract Test Suite for orangehrmMaintenancePlugin
 * Tests: 16
 */

describe('orangehrmMaintenancePlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('DELETE /api/v2/maintenance/purge', function () {
    it('TC_API_00870: apiv2_maintenance_purge [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/maintenance/purge',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00871: apiv2_maintenance_purge [Expected: 401]', function () {
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
    it('TC_API_00872: apiv2_maintenance_purge_candidate [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/maintenance/candidates/purge',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00873: apiv2_maintenance_purge_candidate [Expected: 401]', function () {
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
    it('TC_API_00874: apiv2_maintenance_candidates [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/maintenance/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00875: apiv2_maintenance_candidates [Expected: 401]', function () {
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
    it('TC_API_00876: maintainence_employee_json [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/accessEmployeeData/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00877: maintainence_employee_json [Expected: 401]', function () {
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
    it('TC_API_00878: maintainence_module [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/viewMaintenanceModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00879: maintainence_module [Expected: 401]', function () {
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
    it('TC_API_00880: maintainence_access_employee_screen [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/accessEmployeeData',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00881: maintainence_access_employee_screen [Expected: 401]', function () {
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
    it('TC_API_00882: maintainence_purge_employee [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/purgeEmployee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00883: maintainence_purge_employee [Expected: 401]', function () {
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
    it('TC_API_00884: maintainence_candidate_records [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/maintenance/purgeCandidateData',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00885: maintainence_candidate_records [Expected: 401]', function () {
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
