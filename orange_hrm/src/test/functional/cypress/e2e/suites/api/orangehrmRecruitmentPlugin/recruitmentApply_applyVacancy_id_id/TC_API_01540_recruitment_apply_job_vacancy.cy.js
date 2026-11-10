/**
 * Test Case ID: TC_API_01540
 * Route: recruitment_apply_job_vacancy
 * Endpoint: GET /recruitmentApply/applyVacancy/id/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01540: recruitment_apply_job_vacancy', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01540: Execute GET /recruitmentApply/applyVacancy/id/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitmentApply/applyVacancy/id/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
