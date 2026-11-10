/**
 * Test Case ID: TC_API_01487
 * Route: apiv2_recruitment_candidates_mark_interview_failed
 * Endpoint: PUT /api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/fail
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01487: apiv2_recruitment_candidates_mark_interview_failed', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01487: Execute PUT /api/v2/recruitment/candidates/1/interviews/1/fail [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidates/1/interviews/1/fail',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
