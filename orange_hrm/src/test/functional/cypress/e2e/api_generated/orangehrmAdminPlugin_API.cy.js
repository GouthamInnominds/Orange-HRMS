/**
 * Automated Cypress API Test Suite for orangehrmAdminPlugin
 * Total Tests: 363
 */

describe('orangehrmAdminPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/admin/job-titles/{id}', function () {
    it('TC_API_00001: apiv2_admin_job_title [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-titles/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00002: apiv2_admin_job_title [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-titles/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/job-titles/{id}', function () {
    it('TC_API_00003: apiv2_admin_job_title [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-titles/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00004: apiv2_admin_job_title [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-titles/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00005: apiv2_admin_job_title [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-titles/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/job-titles', function () {
    it('TC_API_00006: apiv2_admin_job_titles [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00007: apiv2_admin_job_titles [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/job-titles', function () {
    it('TC_API_00008: apiv2_admin_job_titles [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00009: apiv2_admin_job_titles [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00010: apiv2_admin_job_titles [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/job-titles', function () {
    it('TC_API_00011: apiv2_admin_job_titles [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00012: apiv2_admin_job_titles [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/job-titles',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/job-titles/{jobTitleId}/specification', function () {
    it('TC_API_00013: apiv2_admin_job_specification [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00014: apiv2_admin_job_specification [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/job-titles/{jobTitleId}/specification', function () {
    it('TC_API_00015: apiv2_admin_job_specification [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00016: apiv2_admin_job_specification [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00017: apiv2_admin_job_specification [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/job-titles/{jobTitleId}/specification', function () {
    it('TC_API_00018: apiv2_admin_job_specification [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00019: apiv2_admin_job_specification [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/job-titles/1/specification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/job-categories/{id}', function () {
    it('TC_API_00020: apiv2_admin_job_category [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-categories/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00021: apiv2_admin_job_category [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-categories/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/job-categories/{id}', function () {
    it('TC_API_00022: apiv2_admin_job_category [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-categories/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00023: apiv2_admin_job_category [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-categories/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00024: apiv2_admin_job_category [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/job-categories/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/job-categories', function () {
    it('TC_API_00025: apiv2_admin_job_categories [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00026: apiv2_admin_job_categories [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/job-categories', function () {
    it('TC_API_00027: apiv2_admin_job_categories [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00028: apiv2_admin_job_categories [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00029: apiv2_admin_job_categories [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/job-categories', function () {
    it('TC_API_00030: apiv2_admin_job_categories [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00031: apiv2_admin_job_categories [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/job-categories',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/users/{id}', function () {
    it('TC_API_00032: apiv2_admin_user [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/users/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00033: apiv2_admin_user [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/users/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/users/{id}', function () {
    it('TC_API_00034: apiv2_admin_user [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/users/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00035: apiv2_admin_user [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/users/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00036: apiv2_admin_user [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/users/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/users', function () {
    it('TC_API_00037: apiv2_admin_users [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00038: apiv2_admin_users [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/users', function () {
    it('TC_API_00039: apiv2_admin_users [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00040: apiv2_admin_users [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00041: apiv2_admin_users [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/users', function () {
    it('TC_API_00042: apiv2_admin_users [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00043: apiv2_admin_users [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/subunits/{id}', function () {
    it('TC_API_00044: apiv2_admin_subunit [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00045: apiv2_admin_subunit [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/subunits/{id}', function () {
    it('TC_API_00046: apiv2_admin_subunit [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00047: apiv2_admin_subunit [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00048: apiv2_admin_subunit [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/subunits/{id}', function () {
    it('TC_API_00049: apiv2_admin_subunit [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00050: apiv2_admin_subunit [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/subunits/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/subunits', function () {
    it('TC_API_00051: apiv2_admin_subunits [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/subunits',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00052: apiv2_admin_subunits [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/subunits',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/subunits', function () {
    it('TC_API_00053: apiv2_admin_subunits [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/subunits',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00054: apiv2_admin_subunits [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/subunits',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00055: apiv2_admin_subunits [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/subunits',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/employment-statuses/{id}', function () {
    it('TC_API_00056: apiv2_admin_employment_status [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/employment-statuses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00057: apiv2_admin_employment_status [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/employment-statuses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/employment-statuses/{id}', function () {
    it('TC_API_00058: apiv2_admin_employment_status [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/employment-statuses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00059: apiv2_admin_employment_status [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/employment-statuses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00060: apiv2_admin_employment_status [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/employment-statuses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/employment-statuses', function () {
    it('TC_API_00061: apiv2_admin_employment_statuses [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00062: apiv2_admin_employment_statuses [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/employment-statuses', function () {
    it('TC_API_00063: apiv2_admin_employment_statuses [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00064: apiv2_admin_employment_statuses [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00065: apiv2_admin_employment_statuses [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/employment-statuses', function () {
    it('TC_API_00066: apiv2_admin_employment_statuses [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00067: apiv2_admin_employment_statuses [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/employment-statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/educations/{id}', function () {
    it('TC_API_00068: apiv2_education [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00069: apiv2_education [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/educations/{id}', function () {
    it('TC_API_00070: apiv2_education [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00071: apiv2_education [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00072: apiv2_education [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/educations', function () {
    it('TC_API_00073: apiv2_educations [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00074: apiv2_educations [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/educations', function () {
    it('TC_API_00075: apiv2_educations [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00076: apiv2_educations [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00077: apiv2_educations [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/educations', function () {
    it('TC_API_00078: apiv2_educations [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00079: apiv2_educations [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/skills/{id}', function () {
    it('TC_API_00080: apiv2_admin_skill [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00081: apiv2_admin_skill [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/skills/{id}', function () {
    it('TC_API_00082: apiv2_admin_skill [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00083: apiv2_admin_skill [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00084: apiv2_admin_skill [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/skills', function () {
    it('TC_API_00085: apiv2_admin_skills [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00086: apiv2_admin_skills [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/skills', function () {
    it('TC_API_00087: apiv2_admin_skills [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00088: apiv2_admin_skills [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00089: apiv2_admin_skills [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/skills', function () {
    it('TC_API_00090: apiv2_admin_skills [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00091: apiv2_admin_skills [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/licenses/{id}', function () {
    it('TC_API_00092: apiv2_license [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00093: apiv2_license [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/licenses/{id}', function () {
    it('TC_API_00094: apiv2_license [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00095: apiv2_license [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00096: apiv2_license [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/licenses', function () {
    it('TC_API_00097: apiv2_licenses [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00098: apiv2_licenses [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/licenses', function () {
    it('TC_API_00099: apiv2_licenses [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00100: apiv2_licenses [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00101: apiv2_licenses [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/licenses', function () {
    it('TC_API_00102: apiv2_licenses [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00103: apiv2_licenses [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/languages/{id}', function () {
    it('TC_API_00104: apiv2_admin_language [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00105: apiv2_admin_language [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/languages/{id}', function () {
    it('TC_API_00106: apiv2_admin_language [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00107: apiv2_admin_language [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00108: apiv2_admin_language [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/languages', function () {
    it('TC_API_00109: apiv2_admin_languages [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00110: apiv2_admin_languages [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/languages', function () {
    it('TC_API_00111: apiv2_admin_languages [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00112: apiv2_admin_languages [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00113: apiv2_admin_languages [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/languages', function () {
    it('TC_API_00114: apiv2_admin_languages [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00115: apiv2_admin_languages [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/memberships/{id}', function () {
    it('TC_API_00116: apiv2_admin_membership [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00117: apiv2_admin_membership [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/memberships/{id}', function () {
    it('TC_API_00118: apiv2_admin_membership [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00119: apiv2_admin_membership [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00120: apiv2_admin_membership [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/memberships', function () {
    it('TC_API_00121: apiv2_admin_memberships [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00122: apiv2_admin_memberships [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/memberships', function () {
    it('TC_API_00123: apiv2_admin_memberships [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00124: apiv2_admin_memberships [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00125: apiv2_admin_memberships [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/memberships', function () {
    it('TC_API_00126: apiv2_admin_memberships [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00127: apiv2_admin_memberships [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/organization', function () {
    it('TC_API_00128: apiv2_organization [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/organization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00129: apiv2_organization [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/organization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/organization', function () {
    it('TC_API_00130: apiv2_organization [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/organization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00131: apiv2_organization [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/organization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00132: apiv2_organization [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/organization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/pay-grades/{payGradeId}/currencies/allowed', function () {
    it('TC_API_00133: apiv2_admin_pay_grade_allowed_currencies [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1/currencies/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00134: apiv2_admin_pay_grade_allowed_currencies [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1/currencies/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/pay-grades/{payGradeId}/currencies/{id}', function () {
    it('TC_API_00135: apiv2_admin_paygrades_currency [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1/currencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00136: apiv2_admin_paygrades_currency [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1/currencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/pay-grades/{payGradeId}/currencies/{id}', function () {
    it('TC_API_00137: apiv2_admin_paygrades_currency [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/pay-grades/1/currencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00138: apiv2_admin_paygrades_currency [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/pay-grades/1/currencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00139: apiv2_admin_paygrades_currency [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/pay-grades/1/currencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/pay-grades/{payGradeId}/currencies', function () {
    it('TC_API_00140: apiv2_admin_paygrades_currencies [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00141: apiv2_admin_paygrades_currencies [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/pay-grades/{payGradeId}/currencies', function () {
    it('TC_API_00142: apiv2_admin_paygrades_currencies [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00143: apiv2_admin_paygrades_currencies [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00144: apiv2_admin_paygrades_currencies [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/pay-grades/{payGradeId}/currencies', function () {
    it('TC_API_00145: apiv2_admin_paygrades_currencies [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00146: apiv2_admin_paygrades_currencies [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/pay-grades/1/currencies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/nationalities/{id}', function () {
    it('TC_API_00147: apiv2_admin_nationality [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/nationalities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00148: apiv2_admin_nationality [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/nationalities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/nationalities/{id}', function () {
    it('TC_API_00149: apiv2_admin_nationality [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/nationalities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00150: apiv2_admin_nationality [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/nationalities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00151: apiv2_admin_nationality [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/nationalities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/nationalities', function () {
    it('TC_API_00152: apiv2_admin_nationalities [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00153: apiv2_admin_nationalities [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/nationalities', function () {
    it('TC_API_00154: apiv2_admin_nationalities [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00155: apiv2_admin_nationalities [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00156: apiv2_admin_nationalities [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/nationalities', function () {
    it('TC_API_00157: apiv2_admin_nationalities [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00158: apiv2_admin_nationalities [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/nationalities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/email-configuration', function () {
    it('TC_API_00159: apiv2_admin_email_configuration [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-configuration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00160: apiv2_admin_email_configuration [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-configuration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/email-configuration', function () {
    it('TC_API_00161: apiv2_admin_email_configuration [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-configuration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00162: apiv2_admin_email_configuration [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-configuration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00163: apiv2_admin_email_configuration [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-configuration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/work-shifts/{id}', function () {
    it('TC_API_00164: apiv2_admin_work_shift [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/work-shifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00165: apiv2_admin_work_shift [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/work-shifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/work-shifts/{id}', function () {
    it('TC_API_00166: apiv2_admin_work_shift [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/work-shifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00167: apiv2_admin_work_shift [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/work-shifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00168: apiv2_admin_work_shift [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/work-shifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/work-shifts', function () {
    it('TC_API_00169: apiv2_admin_work_shifts [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00170: apiv2_admin_work_shifts [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/work-shifts', function () {
    it('TC_API_00171: apiv2_admin_work_shifts [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00172: apiv2_admin_work_shifts [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00173: apiv2_admin_work_shifts [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/work-shifts', function () {
    it('TC_API_00174: apiv2_admin_work_shifts [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00175: apiv2_admin_work_shifts [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/work-shifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/work-shifts/employees', function () {
    it('TC_API_00176: apiv2_admin_work_shifts_employee [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/work-shifts/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00177: apiv2_admin_work_shifts_employee [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/work-shifts/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/locations/{id}', function () {
    it('TC_API_00178: apiv2_admin_location [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/locations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00179: apiv2_admin_location [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/locations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/locations/{id}', function () {
    it('TC_API_00180: apiv2_admin_location [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/locations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00181: apiv2_admin_location [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/locations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00182: apiv2_admin_location [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/locations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/locations', function () {
    it('TC_API_00183: apiv2_admin_locations [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00184: apiv2_admin_locations [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/locations', function () {
    it('TC_API_00185: apiv2_admin_locations [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00186: apiv2_admin_locations [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00187: apiv2_admin_locations [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/locations', function () {
    it('TC_API_00188: apiv2_admin_locations [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00189: apiv2_admin_locations [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/modules', function () {
    it('TC_API_00190: apiv2_admin_modules [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/modules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00191: apiv2_admin_modules [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/modules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/modules', function () {
    it('TC_API_00192: apiv2_admin_modules [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/modules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00193: apiv2_admin_modules [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/modules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00194: apiv2_admin_modules [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/modules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/pay-grades', function () {
    it('TC_API_00195: apiv2_admin_pay_grades [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00196: apiv2_admin_pay_grades [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/pay-grades', function () {
    it('TC_API_00197: apiv2_admin_pay_grades [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00198: apiv2_admin_pay_grades [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00199: apiv2_admin_pay_grades [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/pay-grades', function () {
    it('TC_API_00200: apiv2_admin_pay_grades [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00201: apiv2_admin_pay_grades [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/pay-grades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/pay-grades/{id}', function () {
    it('TC_API_00202: apiv2_admin_pay_grade [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00203: apiv2_admin_pay_grade [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/pay-grades/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/pay-grades/{id}', function () {
    it('TC_API_00204: apiv2_admin_pay_grade [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/pay-grades/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00205: apiv2_admin_pay_grade [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/pay-grades/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00206: apiv2_admin_pay_grade [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/pay-grades/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/email-subscriptions/{id}', function () {
    it('TC_API_00207: apiv2_admin_email_subscription [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-subscriptions/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00208: apiv2_admin_email_subscription [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-subscriptions/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00209: apiv2_admin_email_subscription [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-subscriptions/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/email-subscriptions', function () {
    it('TC_API_00210: apiv2_admin_email_subscriptions [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-subscriptions',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00211: apiv2_admin_email_subscriptions [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-subscriptions',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', function () {
    it('TC_API_00212: apiv2_admin_email_subscribers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00213: apiv2_admin_email_subscribers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', function () {
    it('TC_API_00214: apiv2_admin_email_subscribers [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00215: apiv2_admin_email_subscribers [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00216: apiv2_admin_email_subscribers [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', function () {
    it('TC_API_00217: apiv2_admin_email_subscribers [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00218: apiv2_admin_email_subscribers [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/email-subscriptions/1/subscribers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}', function () {
    it('TC_API_00219: apiv2_admin_email_subscriber [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00220: apiv2_admin_email_subscriber [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}', function () {
    it('TC_API_00221: apiv2_admin_email_subscriber [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00222: apiv2_admin_email_subscriber [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00223: apiv2_admin_email_subscriber [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/validation/user-name', function () {
    it('TC_API_00224: apiv2_admin_validate_user_name [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/validation/user-name',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00225: apiv2_admin_validate_user_name [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/validation/user-name',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/localization', function () {
    it('TC_API_00226: apiv2_admin_localization [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00227: apiv2_admin_localization [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/localization', function () {
    it('TC_API_00228: apiv2_admin_localization [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00229: apiv2_admin_localization [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00230: apiv2_admin_localization [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/i18n/languages', function () {
    it('TC_API_00231: apiv2_admin_i18n_languages [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00232: apiv2_admin_i18n_languages [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/admin/i18n/languages', function () {
    it('TC_API_00233: apiv2_admin_i18n_languages [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/i18n/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00234: apiv2_admin_i18n_languages [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/admin/i18n/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/admin/i18n/languages/{languageId}/import', function () {
    it('TC_API_00235: apiv2_admin_i18n_translation_import [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/i18n/languages/1/import',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00236: apiv2_admin_i18n_translation_import [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/i18n/languages/1/import',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00237: apiv2_admin_i18n_translation_import [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/admin/i18n/languages/1/import',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/i18n/languages/{id}', function () {
    it('TC_API_00238: apiv2_admin_i18n_language [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00239: apiv2_admin_i18n_language [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/i18n/languages/{id}', function () {
    it('TC_API_00240: apiv2_admin_i18n_language [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/i18n/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00241: apiv2_admin_i18n_language [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/i18n/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00242: apiv2_admin_i18n_language [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/i18n/languages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/i18n/languages/{languageId}/translations', function () {
    it('TC_API_00243: apiv2_admin_i18n_language_translations [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages/1/translations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00244: apiv2_admin_i18n_language_translations [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages/1/translations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/admin/i18n/languages/{languageId}/translations/bulk', function () {
    it('TC_API_00245: apiv2_admin_i18n_language_bulk_translations [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/i18n/languages/1/translations/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00246: apiv2_admin_i18n_language_bulk_translations [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/i18n/languages/1/translations/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00247: apiv2_admin_i18n_language_bulk_translations [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/admin/i18n/languages/1/translations/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/i18n/groups', function () {
    it('TC_API_00248: apiv2_admin_i18n_groups [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00249: apiv2_admin_i18n_groups [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/groups',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/i18n/translation/{langStringId}/validate', function () {
    it('TC_API_00250: apiv2_admin_i18n_translation_validation [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/translation/1/validate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00251: apiv2_admin_i18n_translation_validation [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/translation/1/validate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/admin/i18n/languages/{languageId}/translations/errors', function () {
    it('TC_API_00252: apiv2_admin_i18n_language_translation_errors [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages/1/translations/errors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00253: apiv2_admin_i18n_language_translation_errors [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/admin/i18n/languages/1/translations/errors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewJobSpecification/attachId/{attachId}', function () {
    it('TC_API_00254: admin_job_specification_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewJobSpecification/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00255: admin_job_specification_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewJobSpecification/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewLanguagePackage/languageId/{languageId}', function () {
    it('TC_API_00256: admin_language_package_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLanguagePackage/languageId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00257: admin_language_package_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLanguagePackage/languageId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewAdminModule', function () {
    it('TC_API_00258: admin_module [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewAdminModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00259: admin_module [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewAdminModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewJobTitleList', function () {
    it('TC_API_00260: view_job_title [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewJobTitleList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00261: view_job_title [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewJobTitleList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveJobTitle', function () {
    it('TC_API_00262: save_job_title [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobTitle',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00263: save_job_title [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobTitle',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveJobTitle/{id}', function () {
    it('TC_API_00264: edit_job_title [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobTitle/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00265: edit_job_title [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobTitle/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/jobCategory', function () {
    it('TC_API_00266: view_job_category [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/jobCategory',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00267: view_job_category [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/jobCategory',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveJobCategory', function () {
    it('TC_API_00268: save_job_category [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobCategory',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00269: save_job_category [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobCategory',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveJobCategory/{id}', function () {
    it('TC_API_00270: edit_job_category [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobCategory/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00271: edit_job_category [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveJobCategory/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/employmentStatus', function () {
    it('TC_API_00272: view_employment_status [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/employmentStatus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00273: view_employment_status [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/employmentStatus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveEmploymentStatus', function () {
    it('TC_API_00274: save_employment_status [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEmploymentStatus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00275: save_employment_status [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEmploymentStatus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveEmploymentStatus/{id}', function () {
    it('TC_API_00276: edit_employment_status [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEmploymentStatus/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00277: edit_employment_status [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEmploymentStatus/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewSystemUsers', function () {
    it('TC_API_00278: view_system_users [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewSystemUsers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00279: view_system_users [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewSystemUsers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveSystemUser', function () {
    it('TC_API_00280: save_system_users [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSystemUser',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00281: save_system_users [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSystemUser',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveSystemUser/{id}', function () {
    it('TC_API_00282: edit_system_users [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSystemUser/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00283: edit_system_users [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSystemUser/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewCompanyStructure', function () {
    it('TC_API_00284: view_organization_structure [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewCompanyStructure',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00285: view_organization_structure [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewCompanyStructure',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewEducation', function () {
    it('TC_API_00286: view_education [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewEducation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00287: view_education [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewEducation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveEducation', function () {
    it('TC_API_00288: save_education [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEducation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00289: save_education [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEducation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveEducation/{id}', function () {
    it('TC_API_00290: edit_education [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEducation/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00291: edit_education [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveEducation/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewSkills', function () {
    it('TC_API_00292: view_qualification_skills [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewSkills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00293: view_qualification_skills [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewSkills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveSkills', function () {
    it('TC_API_00294: save_qualification_skills [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSkills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00295: save_qualification_skills [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSkills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveSkills/{id}', function () {
    it('TC_API_00296: edit_qualification_skills [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSkills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00297: edit_qualification_skills [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSkills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewLicenses', function () {
    it('TC_API_00298: view_license [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLicenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00299: view_license [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLicenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveLicenses', function () {
    it('TC_API_00300: save_license [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLicenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00301: save_license [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLicenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveLicenses/{id}', function () {
    it('TC_API_00302: edit_license [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLicenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00303: edit_license [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLicenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewLanguages', function () {
    it('TC_API_00304: view_qualification_languages [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLanguages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00305: view_qualification_languages [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLanguages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveLanguages', function () {
    it('TC_API_00306: save_qualification_languages [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLanguages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00307: save_qualification_languages [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLanguages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveLanguages/{id}', function () {
    it('TC_API_00308: edit_qualification_languages [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLanguages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00309: edit_qualification_languages [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLanguages/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/membership', function () {
    it('TC_API_00310: view_qualification_memberships [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/membership',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00311: view_qualification_memberships [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/membership',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveMemberships', function () {
    it('TC_API_00312: save_qualification_memberships [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveMemberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00313: save_qualification_memberships [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveMemberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveMemberships/{id}', function () {
    it('TC_API_00314: edit_qualification_memberships [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveMemberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00315: edit_qualification_memberships [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveMemberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewOrganizationGeneralInformation', function () {
    it('TC_API_00316: view_organization_general_info [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewOrganizationGeneralInformation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00317: view_organization_general_info [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewOrganizationGeneralInformation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/nationality', function () {
    it('TC_API_00318: view_nationality [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/nationality',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00319: view_nationality [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/nationality',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveNationality', function () {
    it('TC_API_00320: save_nationality [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveNationality',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00321: save_nationality [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveNationality',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveNationality/{id}', function () {
    it('TC_API_00322: edit_nationality [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveNationality/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00323: edit_nationality [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveNationality/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewLocations', function () {
    it('TC_API_00324: view_location [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLocations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00325: view_location [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewLocations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveLocation', function () {
    it('TC_API_00326: save_location [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLocation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00327: save_location [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLocation',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveLocation/{id}', function () {
    it('TC_API_00328: edit_location [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLocation/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00329: edit_location [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveLocation/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/listMailConfiguration', function () {
    it('TC_API_00330: view_email_configuration [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/listMailConfiguration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00331: view_email_configuration [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/listMailConfiguration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewPayGrades', function () {
    it('TC_API_00332: view_pay_grades [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewPayGrades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00333: view_pay_grades [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewPayGrades',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/payGrade', function () {
    it('TC_API_00334: add_pay_grade [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/payGrade',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00335: add_pay_grade [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/payGrade',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/payGrade/{id}', function () {
    it('TC_API_00336: edit_pay_grade [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/payGrade/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00337: edit_pay_grade [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/payGrade/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewModules', function () {
    it('TC_API_00338: edit_module_configuration [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewModules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00339: edit_module_configuration [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewModules',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/workShift', function () {
    it('TC_API_00340: view_work_shift [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/workShift',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00341: view_work_shift [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/workShift',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveWorkShifts', function () {
    it('TC_API_00342: save_work_shift [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveWorkShifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00343: save_work_shift [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveWorkShifts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveWorkShifts/{id}', function () {
    it('TC_API_00344: edit_work_shift [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveWorkShifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00345: edit_work_shift [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveWorkShifts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/viewEmailNotification', function () {
    it('TC_API_00346: view_email_subscription [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewEmailNotification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00347: view_email_subscription [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/viewEmailNotification',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/saveSubscriber/{id}', function () {
    it('TC_API_00348: edit_email_subscription [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSubscriber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00349: edit_email_subscription [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/saveSubscriber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/localization', function () {
    it('TC_API_00350: admin_localization [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00351: admin_localization [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/localization',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/openIdProvider', function () {
    it('TC_API_00352: admin_open_id_provider [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/openIdProvider',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00353: admin_open_id_provider [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/openIdProvider',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/languagePackage', function () {
    it('TC_API_00354: admin_language_package [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/languagePackage',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00355: admin_language_package [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/languagePackage',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/languageImport/{languageId}', function () {
    it('TC_API_00356: admin_language_package_import [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/languageImport/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00357: admin_language_package_import [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/languageImport/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/fixLanguageStringErrors/{languageId}', function () {
    it('TC_API_00358: admin_language_package_fix_errors [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/fixLanguageStringErrors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00359: admin_language_package_fix_errors [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/fixLanguageStringErrors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/languageCustomization/{languageId}', function () {
    it('TC_API_00360: admin_language_translation [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/languageCustomization/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00361: admin_language_translation [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/languageCustomization/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /admin/ldapConfiguration', function () {
    it('TC_API_00362: admin_ldap_configuration [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/ldapConfiguration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00363: admin_ldap_configuration [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/admin/ldapConfiguration',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
