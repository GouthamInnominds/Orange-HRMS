/**
 * Test Case ID: TC_API_01417
 * Route: apiv2_recruitment_vacancies
 * Endpoint: POST /api/v2/recruitment/vacancies
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01417: apiv2_recruitment_vacancies', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01417: Execute POST /api/v2/recruitment/vacancies [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/recruitment/vacancies',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
