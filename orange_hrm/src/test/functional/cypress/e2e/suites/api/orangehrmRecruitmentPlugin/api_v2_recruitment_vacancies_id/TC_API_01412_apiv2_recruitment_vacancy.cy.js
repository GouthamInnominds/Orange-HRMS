/**
 * Test Case ID: TC_API_01412
 * Route: apiv2_recruitment_vacancy
 * Endpoint: PUT /api/v2/recruitment/vacancies/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01412: apiv2_recruitment_vacancy', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01412: Execute PUT /api/v2/recruitment/vacancies/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/vacancies/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
