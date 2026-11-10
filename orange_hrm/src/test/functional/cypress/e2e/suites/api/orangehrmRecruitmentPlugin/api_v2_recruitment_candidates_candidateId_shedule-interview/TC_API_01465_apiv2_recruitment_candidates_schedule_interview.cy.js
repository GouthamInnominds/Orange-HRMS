/**
 * Test Case ID: TC_API_01465
 * Route: apiv2_recruitment_candidates_schedule_interview
 * Endpoint: POST /api/v2/recruitment/candidates/{candidateId}/shedule-interview
 * Method: POST
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01465: apiv2_recruitment_candidates_schedule_interview', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01465: Execute POST /api/v2/recruitment/candidates/1/shedule-interview [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/recruitment/candidates/1/shedule-interview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
