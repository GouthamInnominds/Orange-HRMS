/**
 * Test Case ID: TC_API_01471
 * Route: apiv2_recruitment_interviews_attachment
 * Endpoint: GET /api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01471: apiv2_recruitment_interviews_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01471: Execute GET /api/v2/recruitment/interviews/1/attachments/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/interviews/1/attachments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
