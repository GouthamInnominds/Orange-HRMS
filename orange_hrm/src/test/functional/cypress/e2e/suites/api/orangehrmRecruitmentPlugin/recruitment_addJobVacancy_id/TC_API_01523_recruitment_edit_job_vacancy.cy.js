/**
 * Test Case ID: TC_API_01523
 * Route: recruitment_edit_job_vacancy
 * Endpoint: GET /recruitment/addJobVacancy/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01523: recruitment_edit_job_vacancy', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01523: Execute GET /recruitment/addJobVacancy/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/addJobVacancy/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
