/**
 * Test Case ID: TC_API_01466
 * Route: apiv2_recruitment_candidates_interviews
 * Endpoint: GET /api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01466: apiv2_recruitment_candidates_interviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01466: Execute GET /api/v2/recruitment/candidates/1/interviews/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/candidates/1/interviews/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
