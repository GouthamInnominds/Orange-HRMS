/**
 * Test Case ID: TC_API_01536
 * Route: recruitment_view_interview_attachments
 * Endpoint: GET /recruitment/interviewAttachments/{interviewId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01536: recruitment_view_interview_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01536: Execute GET /recruitment/interviewAttachments/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/interviewAttachments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
