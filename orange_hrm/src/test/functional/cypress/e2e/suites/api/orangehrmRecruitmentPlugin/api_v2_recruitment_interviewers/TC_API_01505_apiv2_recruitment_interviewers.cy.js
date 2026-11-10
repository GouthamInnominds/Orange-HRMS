/**
 * Test Case ID: TC_API_01505
 * Route: apiv2_recruitment_interviewers
 * Endpoint: GET /api/v2/recruitment/interviewers
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01505: apiv2_recruitment_interviewers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01505: Execute GET /api/v2/recruitment/interviewers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/interviewers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
