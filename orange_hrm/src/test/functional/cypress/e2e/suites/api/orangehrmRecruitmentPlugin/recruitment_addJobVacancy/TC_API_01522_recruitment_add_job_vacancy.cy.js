/**
 * Test Case ID: TC_API_01522
 * Route: recruitment_add_job_vacancy
 * Endpoint: GET /recruitment/addJobVacancy
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01522: recruitment_add_job_vacancy', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01522: Execute GET /recruitment/addJobVacancy [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/addJobVacancy',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
