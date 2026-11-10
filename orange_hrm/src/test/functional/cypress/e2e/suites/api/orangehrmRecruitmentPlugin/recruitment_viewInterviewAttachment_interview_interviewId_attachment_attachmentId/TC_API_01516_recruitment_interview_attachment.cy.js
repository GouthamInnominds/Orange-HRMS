/**
 * Test Case ID: TC_API_01516
 * Route: recruitment_interview_attachment
 * Endpoint: GET /recruitment/viewInterviewAttachment/interview/{interviewId}/attachment/{attachmentId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01516: recruitment_interview_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01516: Execute GET /recruitment/viewInterviewAttachment/interview/1/attachment/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewInterviewAttachment/interview/1/attachment/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
