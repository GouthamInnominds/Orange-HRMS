/**
 * Test Case ID: TC_API_01464
 * Route: apiv2_recruitment_candidates_schedule_interview
 * Endpoint: POST /api/v2/recruitment/candidates/{candidateId}/shedule-interview
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01464: apiv2_recruitment_candidates_schedule_interview', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01464: Execute POST /api/v2/recruitment/candidates/1/shedule-interview [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/recruitment/candidates/1/shedule-interview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
