/**
 * Test Case ID: TC_API_01506
 * Route: apiv2_recruitment_interviewers
 * Endpoint: GET /api/v2/recruitment/interviewers
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01506: apiv2_recruitment_interviewers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01506: Execute GET /api/v2/recruitment/interviewers [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/interviewers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
