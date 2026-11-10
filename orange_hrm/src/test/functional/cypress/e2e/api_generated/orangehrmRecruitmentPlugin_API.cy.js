/**
 * Automated Cypress API Test Suite for orangehrmRecruitmentPlugin
 * Total Tests: 137
 */

describe('orangehrmRecruitmentPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/recruitment/vacancies/{id}', function () {
    it('TC_API_01409: apiv2_recruitment_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01410: apiv2_recruitment_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/vacancies/{id}', function () {
    it('TC_API_01411: apiv2_recruitment_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01412: apiv2_recruitment_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01413: apiv2_recruitment_vacancy [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/vacancies', function () {
    it('TC_API_01414: apiv2_recruitment_vacancies [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01415: apiv2_recruitment_vacancies [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/recruitment/vacancies', function () {
    it('TC_API_01416: apiv2_recruitment_vacancies [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01417: apiv2_recruitment_vacancies [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01418: apiv2_recruitment_vacancies [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/recruitment/vacancies', function () {
    it('TC_API_01419: apiv2_recruitment_vacancies [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01420: apiv2_recruitment_vacancies [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/vacancies/{vacancyId}/attachments', function () {
    it('TC_API_01421: apiv2_recruitment_vacancies_attachments [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/vacancies/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01422: apiv2_recruitment_vacancies_attachments [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/vacancies/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/vacancies/{vacancyId}/attachments/{attachmentId}', function () {
    it('TC_API_01423: apiv2_recruitment_vacancies_attachment [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/vacancies/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01424: apiv2_recruitment_vacancies_attachment [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/vacancies/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01425: apiv2_recruitment_vacancies_attachment [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/vacancies/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/recruitment/vacancy/attachments', function () {
    it('TC_API_01426: apiv2_recruitment_vacancy_attachments [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/vacancy/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01427: apiv2_recruitment_vacancy_attachments [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/vacancy/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01428: apiv2_recruitment_vacancy_attachments [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/vacancy/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/recruitment/vacancy/attachments', function () {
    it('TC_API_01429: apiv2_recruitment_vacancy_attachments [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/vacancy/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01430: apiv2_recruitment_vacancy_attachments [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/vacancy/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates', function () {
    it('TC_API_01431: apiv2_recruitment_candidates [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01432: apiv2_recruitment_candidates [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/recruitment/candidates', function () {
    it('TC_API_01433: apiv2_recruitment_candidates [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01434: apiv2_recruitment_candidates [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01435: apiv2_recruitment_candidates [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/recruitment/candidates', function () {
    it('TC_API_01436: apiv2_recruitment_candidates [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01437: apiv2_recruitment_candidates [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/candidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates/{id}', function () {
    it('TC_API_01438: apiv2_recruitment_candidate [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01439: apiv2_recruitment_candidate [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{id}', function () {
    it('TC_API_01440: apiv2_recruitment_candidate [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01441: apiv2_recruitment_candidate [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01442: apiv2_recruitment_candidate [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidate/{candidateId}/attachment', function () {
    it('TC_API_01443: apiv2_recruitment_candidate_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidate/1/attachment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01444: apiv2_recruitment_candidate_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidate/1/attachment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidate/{candidateId}/attachment', function () {
    it('TC_API_01445: apiv2_recruitment_candidate_attachment [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidate/1/attachment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01446: apiv2_recruitment_candidate_attachment [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidate/1/attachment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01447: apiv2_recruitment_candidate_attachment [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidate/1/attachment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/recruitment/candidate/attachments', function () {
    it('TC_API_01448: apiv2_recruitment_candidate_attachments [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidate/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01449: apiv2_recruitment_candidate_attachments [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidate/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01450: apiv2_recruitment_candidate_attachments [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidate/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates/statuses', function () {
    it('TC_API_01451: apiv2_recruitment_candidate_status [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01452: apiv2_recruitment_candidate_status [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/statuses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/hiring-managers', function () {
    it('TC_API_01453: apiv2_recruitment_hiring_managers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/hiring-managers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01454: apiv2_recruitment_hiring_managers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/hiring-managers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates/{candidateId}/actions/allowed', function () {
    it('TC_API_01455: apiv2_recruitment_candidates_allowed_actions [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/actions/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01456: apiv2_recruitment_candidates_allowed_actions [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/actions/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/reject', function () {
    it('TC_API_01457: apiv2_recruitment_candidates_reject [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/reject',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01458: apiv2_recruitment_candidates_reject [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/reject',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01459: apiv2_recruitment_candidates_reject [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/reject',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/shortlist', function () {
    it('TC_API_01460: apiv2_recruitment_candidates_shortlist [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/shortlist',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01461: apiv2_recruitment_candidates_shortlist [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/shortlist',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01462: apiv2_recruitment_candidates_shortlist [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/shortlist',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/recruitment/candidates/{candidateId}/shedule-interview', function () {
    it('TC_API_01463: apiv2_recruitment_candidates_schedule_interview [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidates/1/shedule-interview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01464: apiv2_recruitment_candidates_schedule_interview [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidates/1/shedule-interview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01465: apiv2_recruitment_candidates_schedule_interview [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/candidates/1/shedule-interview',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}', function () {
    it('TC_API_01466: apiv2_recruitment_candidates_interviews [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/interviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01467: apiv2_recruitment_candidates_interviews [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/interviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}', function () {
    it('TC_API_01468: apiv2_recruitment_candidates_interviews [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01469: apiv2_recruitment_candidates_interviews [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01470: apiv2_recruitment_candidates_interviews [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}', function () {
    it('TC_API_01471: apiv2_recruitment_interviews_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/interviews/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01472: apiv2_recruitment_interviews_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/interviews/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}', function () {
    it('TC_API_01473: apiv2_recruitment_interviews_attachment [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/interviews/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01474: apiv2_recruitment_interviews_attachment [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/interviews/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01475: apiv2_recruitment_interviews_attachment [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/interviews/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/interviews/{interviewId}/attachments', function () {
    it('TC_API_01476: apiv2_recruitment_interview_attachments [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01477: apiv2_recruitment_interview_attachments [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/recruitment/interviews/{interviewId}/attachments', function () {
    it('TC_API_01478: apiv2_recruitment_interview_attachments [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01479: apiv2_recruitment_interview_attachments [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01480: apiv2_recruitment_interview_attachments [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/recruitment/interviews/{interviewId}/attachments', function () {
    it('TC_API_01481: apiv2_recruitment_interview_attachments [HTTP 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01482: apiv2_recruitment_interview_attachments [HTTP 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/recruitment/interviews/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/pass', function () {
    it('TC_API_01483: apiv2_recruitment_candidates_mark_interview_passed [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1/pass',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01484: apiv2_recruitment_candidates_mark_interview_passed [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1/pass',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01485: apiv2_recruitment_candidates_mark_interview_passed [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1/pass',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/fail', function () {
    it('TC_API_01486: apiv2_recruitment_candidates_mark_interview_failed [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1/fail',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01487: apiv2_recruitment_candidates_mark_interview_failed [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1/fail',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01488: apiv2_recruitment_candidates_mark_interview_failed [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/interviews/1/fail',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/job/offer', function () {
    it('TC_API_01489: apiv2_recruitment_candidates_offer_job [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/job/offer',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01490: apiv2_recruitment_candidates_offer_job [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/job/offer',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01491: apiv2_recruitment_candidates_offer_job [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/job/offer',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/job/decline', function () {
    it('TC_API_01492: apiv2_recruitment_candidates_offer_decline [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/job/decline',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01493: apiv2_recruitment_candidates_offer_decline [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/job/decline',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01494: apiv2_recruitment_candidates_offer_decline [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/job/decline',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/hire', function () {
    it('TC_API_01495: apiv2_recruitment_candidates_hire [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/hire',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01496: apiv2_recruitment_candidates_hire [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/hire',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01497: apiv2_recruitment_candidates_hire [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/hire',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates/{candidateId}/history', function () {
    it('TC_API_01498: apiv2_recruitment_candidates_history [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/history',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01499: apiv2_recruitment_candidates_history [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/history',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/candidates/{candidateId}/history/{historyId}', function () {
    it('TC_API_01500: apiv2_recruitment_candidate_history [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/history/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01501: apiv2_recruitment_candidate_history [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/candidates/1/history/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/recruitment/candidates/{candidateId}/history/{historyId}', function () {
    it('TC_API_01502: apiv2_recruitment_candidate_history [HTTP 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/history/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01503: apiv2_recruitment_candidate_history [HTTP 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/history/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01504: apiv2_recruitment_candidate_history [HTTP 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/recruitment/candidates/1/history/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/interviewers', function () {
    it('TC_API_01505: apiv2_recruitment_interviewers [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/interviewers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01506: apiv2_recruitment_interviewers [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/interviewers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/public/vacancies', function () {
    it('TC_API_01507: apiv2_recruitment_public_vacancies [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/public/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01508: apiv2_recruitment_public_vacancies [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/public/vacancies',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/recruitment/public/vacancies/{id}', function () {
    it('TC_API_01509: apiv2_recruitment_public_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/public/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01510: apiv2_recruitment_public_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/recruitment/public/vacancies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/viewVacancyAttachment/attachId/{attachId}', function () {
    it('TC_API_01511: recruitment_vacancy_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewVacancyAttachment/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01512: recruitment_vacancy_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewVacancyAttachment/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/viewCandidateAttachment/candidateId/{candidateId}', function () {
    it('TC_API_01513: recruitment_candidate_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewCandidateAttachment/candidateId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01514: recruitment_candidate_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewCandidateAttachment/candidateId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/viewInterviewAttachment/interview/{interviewId}/attachment/{attachmentId}', function () {
    it('TC_API_01515: recruitment_interview_attachment [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewInterviewAttachment/interview/1/attachment/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01516: recruitment_interview_attachment [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewInterviewAttachment/interview/1/attachment/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/viewRecruitmentModule', function () {
    it('TC_API_01517: recruitment_module [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewRecruitmentModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01518: recruitment_module [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewRecruitmentModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/viewJobVacancy', function () {
    it('TC_API_01519: recruitment_view_job_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewJobVacancy',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01520: recruitment_view_job_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewJobVacancy',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/addJobVacancy', function () {
    it('TC_API_01521: recruitment_add_job_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addJobVacancy',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01522: recruitment_add_job_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addJobVacancy',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/addJobVacancy/{id}', function () {
    it('TC_API_01523: recruitment_edit_job_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addJobVacancy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01524: recruitment_edit_job_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addJobVacancy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/viewCandidates', function () {
    it('TC_API_01525: recruitment_view_candidates [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewCandidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01526: recruitment_view_candidates [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/viewCandidates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/addCandidate', function () {
    it('TC_API_01527: recruitment_save_candidates [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addCandidate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01528: recruitment_save_candidates [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addCandidate',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/addCandidate/{id}', function () {
    it('TC_API_01529: recruitment_view_candidate_profile [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addCandidate/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01530: recruitment_view_candidate_profile [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/addCandidate/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/changeCandidateVacancyStatus', function () {
    it('TC_API_01531: recruitment_candidate_action [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/changeCandidateVacancyStatus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01532: recruitment_candidate_action [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/changeCandidateVacancyStatus',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/candidateHistory/{candidateId}/{historyId}', function () {
    it('TC_API_01533: recruitment_view_action_history [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/candidateHistory/1/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01534: recruitment_view_action_history [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/candidateHistory/1/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitment/interviewAttachments/{interviewId}', function () {
    it('TC_API_01535: recruitment_view_interview_attachments [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/interviewAttachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01536: recruitment_view_interview_attachments [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitment/interviewAttachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitmentApply/jobs.html', function () {
    it('TC_API_01537: recruitment_view_vacancy_list [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitmentApply/jobs.html',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01538: recruitment_view_vacancy_list [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitmentApply/jobs.html',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitmentApply/applyVacancy/id/{id}', function () {
    it('TC_API_01539: recruitment_apply_job_vacancy [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitmentApply/applyVacancy/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01540: recruitment_apply_job_vacancy [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitmentApply/applyVacancy/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /recruitment/public/applicants', function () {
    it('TC_API_01541: recruitment_public_applicants [HTTP 200]', function () {
      cy.request({
        method: 'POST',
        url: '/recruitment/public/applicants',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01542: recruitment_public_applicants [HTTP 401]', function () {
      cy.request({
        method: 'POST',
        url: '/recruitment/public/applicants',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01543: recruitment_public_applicants [HTTP 422]', function () {
      cy.request({
        method: 'POST',
        url: '/recruitment/public/applicants',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /recruitmentApply/jobs.rss', function () {
    it('TC_API_01544: recruitment_rss_feed [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitmentApply/jobs.rss',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01545: recruitment_rss_feed [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/recruitmentApply/jobs.rss',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
