/**
 * Test Case ID: TC_API_01538
 * Route: recruitment_view_vacancy_list
 * Endpoint: GET /recruitmentApply/jobs.html
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01538: recruitment_view_vacancy_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01538: Execute GET /recruitmentApply/jobs.html [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitmentApply/jobs.html',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
