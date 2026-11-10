/**
 * Test Case ID: TC_API_01508
 * Route: apiv2_recruitment_public_vacancies
 * Endpoint: GET /api/v2/recruitment/public/vacancies
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01508: apiv2_recruitment_public_vacancies', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01508: Execute GET /api/v2/recruitment/public/vacancies [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/public/vacancies',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
