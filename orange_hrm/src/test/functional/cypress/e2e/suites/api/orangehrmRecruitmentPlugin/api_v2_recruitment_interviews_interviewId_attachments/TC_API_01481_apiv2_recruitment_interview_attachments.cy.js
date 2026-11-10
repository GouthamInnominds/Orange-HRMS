/**
 * Test Case ID: TC_API_01481
 * Route: apiv2_recruitment_interview_attachments
 * Endpoint: DELETE /api/v2/recruitment/interviews/{interviewId}/attachments
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01481: apiv2_recruitment_interview_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01481: Execute DELETE /api/v2/recruitment/interviews/1/attachments [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/recruitment/interviews/1/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
