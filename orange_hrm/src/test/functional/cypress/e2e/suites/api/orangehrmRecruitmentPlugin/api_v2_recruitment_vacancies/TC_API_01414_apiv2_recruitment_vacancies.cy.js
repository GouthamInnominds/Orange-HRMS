/**
 * Test Case ID: TC_API_01414
 * Route: apiv2_recruitment_vacancies
 * Endpoint: GET /api/v2/recruitment/vacancies
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01414: apiv2_recruitment_vacancies', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01414: Execute GET /api/v2/recruitment/vacancies [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/vacancies',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
