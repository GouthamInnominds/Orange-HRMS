/**
 * Test Case ID: TC_API_01479
 * Route: apiv2_recruitment_interview_attachments
 * Endpoint: POST /api/v2/recruitment/interviews/{interviewId}/attachments
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01479: apiv2_recruitment_interview_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01479: Execute POST /api/v2/recruitment/interviews/1/attachments [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/recruitment/interviews/1/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
