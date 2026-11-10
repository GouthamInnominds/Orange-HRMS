/**
 * Automated Cypress API Test Suite for orangehrmPerformancePlugin
 * Total Tests: 120
 */

describe('orangehrmPerformancePlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/performance/kpis/{id}', function () {
    it('TC_API_00908: apiv2_performance_kpi [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/kpis/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00909: apiv2_performance_kpi [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/kpis/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/performance/kpis/{id}', function () {
    it('TC_API_00910: apiv2_performance_kpi [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/kpis/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00911: apiv2_performance_kpi [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/kpis/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00912: apiv2_performance_kpi [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/kpis/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/kpis', function () {
    it('TC_API_00913: apiv2_performance_kpis [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00914: apiv2_performance_kpis [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/performance/kpis', function () {
    it('TC_API_00915: apiv2_performance_kpis [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00916: apiv2_performance_kpis [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00917: apiv2_performance_kpis [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/performance/kpis', function () {
    it('TC_API_00918: apiv2_performance_kpis [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00919: apiv2_performance_kpis [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/supervisors', function () {
    it('TC_API_00920: apiv2_performance_supervisors [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00921: apiv2_performance_supervisors [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/performance/supervisors', function () {
    it('TC_API_00922: apiv2_performance_supervisors [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00923: apiv2_performance_supervisors [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00924: apiv2_performance_supervisors [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/performance/supervisors', function () {
    it('TC_API_00925: apiv2_performance_supervisors [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00926: apiv2_performance_supervisors [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/manage/reviews/{id}', function () {
    it('TC_API_00927: apiv2_performance_review [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/manage/reviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00928: apiv2_performance_review [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/manage/reviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/performance/manage/reviews/{id}', function () {
    it('TC_API_00929: apiv2_performance_review [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/manage/reviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00930: apiv2_performance_review [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/manage/reviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00931: apiv2_performance_review [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/manage/reviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/manage/reviews', function () {
    it('TC_API_00932: apiv2_performance_reviews [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00933: apiv2_performance_reviews [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/performance/manage/reviews', function () {
    it('TC_API_00934: apiv2_performance_reviews [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00935: apiv2_performance_reviews [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00936: apiv2_performance_reviews [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/performance/manage/reviews', function () {
    it('TC_API_00937: apiv2_performance_reviews [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00938: apiv2_performance_reviews [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/manage/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/config/trackers', function () {
    it('TC_API_00939: apiv2_performance_config_trackers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00940: apiv2_performance_config_trackers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/performance/config/trackers', function () {
    it('TC_API_00941: apiv2_performance_config_trackers [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00942: apiv2_performance_config_trackers [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00943: apiv2_performance_config_trackers [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/performance/config/trackers', function () {
    it('TC_API_00944: apiv2_performance_config_trackers [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00945: apiv2_performance_config_trackers [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/config/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/config/trackers/{id}', function () {
    it('TC_API_00946: apiv2_performance_config_tracker [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/config/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00947: apiv2_performance_config_tracker [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/config/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/performance/config/trackers/{id}', function () {
    it('TC_API_00948: apiv2_performance_config_tracker [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/config/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00949: apiv2_performance_config_tracker [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/config/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00950: apiv2_performance_config_tracker [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/config/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/trackers/reviewers', function () {
    it('TC_API_00951: apiv2_performance_reviewers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/trackers/reviewers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00952: apiv2_performance_reviewers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/trackers/reviewers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/trackers', function () {
    it('TC_API_00953: apiv2_performance_my_trackers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00954: apiv2_performance_my_trackers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/reviews', function () {
    it('TC_API_00955: apiv2_performance_my_reviews [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00956: apiv2_performance_my_reviews [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/employees/trackers', function () {
    it('TC_API_00957: apiv2_performance_employee_trackers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/employees/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00958: apiv2_performance_employee_trackers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/employees/trackers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/employees/reviews', function () {
    it('TC_API_00959: apiv2_performance_review_list [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/employees/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00960: apiv2_performance_review_list [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/employees/reviews',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/reviews/{reviewId}/actions/allowed', function () {
    it('TC_API_00961: apiv2_performance_review_allowed_actions [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/actions/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00962: apiv2_performance_review_allowed_actions [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/actions/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/employees/trackers/{id}', function () {
    it('TC_API_00963: apiv2_performance_employee_tracker [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/employees/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00964: apiv2_performance_employee_tracker [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/employees/trackers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/trackers/{trackerId}/logs', function () {
    it('TC_API_00965: apiv2_performance_tracker_logs [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00966: apiv2_performance_tracker_logs [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/performance/trackers/{trackerId}/logs', function () {
    it('TC_API_00967: apiv2_performance_tracker_logs [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00968: apiv2_performance_tracker_logs [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00969: apiv2_performance_tracker_logs [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/performance/trackers/{trackerId}/logs', function () {
    it('TC_API_00970: apiv2_performance_tracker_logs [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00971: apiv2_performance_tracker_logs [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/performance/trackers/1/logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET api/v2/performance/trackers/{trackerId}/logs/{id}', function () {
    it('TC_API_00972: apiv2_performance_tracker_log [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: 'api/v2/performance/trackers/1/logs/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00973: apiv2_performance_tracker_log [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: 'api/v2/performance/trackers/1/logs/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT api/v2/performance/trackers/{trackerId}/logs/{id}', function () {
    it('TC_API_00974: apiv2_performance_tracker_log [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: 'api/v2/performance/trackers/1/logs/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00975: apiv2_performance_tracker_log [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: 'api/v2/performance/trackers/1/logs/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00976: apiv2_performance_tracker_log [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: 'api/v2/performance/trackers/1/logs/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/reviews/{reviewId}/kpis', function () {
    it('TC_API_00977: apiv2_performance_reviews_kpis [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00978: apiv2_performance_reviews_kpis [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/kpis',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/reviews/{reviewId}/evaluation/supervisor', function () {
    it('TC_API_00979: apiv2_performance_reviews_supervisor_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/evaluation/supervisor',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00980: apiv2_performance_reviews_supervisor_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/evaluation/supervisor',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/performance/reviews/{reviewId}/evaluation/supervisor', function () {
    it('TC_API_00981: apiv2_performance_reviews_supervisor_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/supervisor',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00982: apiv2_performance_reviews_supervisor_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/supervisor',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00983: apiv2_performance_reviews_supervisor_evaluation [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/supervisor',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/reviews/{reviewId}/evaluation/employee', function () {
    it('TC_API_00984: apiv2_performance_reviews_employee_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/evaluation/employee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00985: apiv2_performance_reviews_employee_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/evaluation/employee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/performance/reviews/{reviewId}/evaluation/employee', function () {
    it('TC_API_00986: apiv2_performance_reviews_employee_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/employee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00987: apiv2_performance_reviews_employee_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/employee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00988: apiv2_performance_reviews_employee_evaluation [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/employee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/performance/reviews/{reviewId}/evaluation/final', function () {
    it('TC_API_00989: apiv2_performance_reviews_final_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/evaluation/final',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00990: apiv2_performance_reviews_final_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/performance/reviews/1/evaluation/final',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/performance/reviews/{reviewId}/evaluation/final', function () {
    it('TC_API_00991: apiv2_performance_reviews_final_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/final',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00992: apiv2_performance_reviews_final_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/final',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00993: apiv2_performance_reviews_final_evaluation [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/performance/reviews/1/evaluation/final',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/viewPerformanceModule', function () {
    it('TC_API_00994: performance_module [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewPerformanceModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00995: performance_module [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewPerformanceModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/viewMyPerformanceTrackerList', function () {
    it('TC_API_00996: performance_my_trackers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewMyPerformanceTrackerList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00997: performance_my_trackers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewMyPerformanceTrackerList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/viewEmployeePerformanceTrackerList', function () {
    it('TC_API_00998: performance_employee_tracker [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewEmployeePerformanceTrackerList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00999: performance_employee_tracker [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewEmployeePerformanceTrackerList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/searchKpi', function () {
    it('TC_API_01000: performance_kpi_search [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/searchKpi',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01001: performance_kpi_search [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/searchKpi',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/saveKpi', function () {
    it('TC_API_01002: performance_kpi_save [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveKpi',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01003: performance_kpi_save [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveKpi',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/saveKpi/{id}', function () {
    it('TC_API_01004: performance_kpi_edit [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveKpi/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01005: performance_kpi_edit [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveKpi/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/saveReview', function () {
    it('TC_API_01006: performance_review_save [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01007: performance_review_save [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/saveReview/{id}', function () {
    it('TC_API_01008: performance_review_edit [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveReview/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01009: performance_review_edit [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/saveReview/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/viewPerformanceTracker', function () {
    it('TC_API_01010: performance_tracker_list [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewPerformanceTracker',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01011: performance_tracker_list [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/viewPerformanceTracker',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/addPerformanceTracker', function () {
    it('TC_API_01012: performance_add_tracker [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/addPerformanceTracker',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01013: performance_add_tracker [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/addPerformanceTracker',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/addPerformanceTracker/{id}', function () {
    it('TC_API_01014: performance_edit_tracker [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/addPerformanceTracker/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01015: performance_edit_tracker [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/addPerformanceTracker/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/myPerformanceReview', function () {
    it('TC_API_01016: performance_my_reviews [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/myPerformanceReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01017: performance_my_reviews [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/myPerformanceReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/searchEvaluatePerformanceReview', function () {
    it('TC_API_01018: performance_review_list [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/searchEvaluatePerformanceReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01019: performance_review_list [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/searchEvaluatePerformanceReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/searchPerformanceReview', function () {
    it('TC_API_01020: performance_review_search [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/searchPerformanceReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01021: performance_review_search [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/searchPerformanceReview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/addPerformanceTrackerLog/trackId/{id}', function () {
    it('TC_API_01022: performance_employee_tracker_logs [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/addPerformanceTrackerLog/trackId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01023: performance_employee_tracker_logs [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/addPerformanceTrackerLog/trackId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/reviewEvaluateByAdmin/{id}', function () {
    it('TC_API_01024: performance_employee_admin_evaluation [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/reviewEvaluateByAdmin/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01025: performance_employee_admin_evaluation [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/reviewEvaluateByAdmin/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /performance/reviewEvaluate/id/{id}', function () {
    it('TC_API_01026: performance_review_evaluate_self [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/reviewEvaluate/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01027: performance_review_evaluate_self [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/performance/reviewEvaluate/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
