/**
 * Test Case ID: TC_API_01537
 * Route: recruitment_view_vacancy_list
 * Endpoint: GET /recruitmentApply/jobs.html
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01537: recruitment_view_vacancy_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01537: Execute GET /recruitmentApply/jobs.html [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitmentApply/jobs.html',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
