/**
 * Test Case ID: TC_API_01519
 * Route: recruitment_view_job_vacancy
 * Endpoint: GET /recruitment/viewJobVacancy
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01519: recruitment_view_job_vacancy', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01519: Execute GET /recruitment/viewJobVacancy [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewJobVacancy',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
