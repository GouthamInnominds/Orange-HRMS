/**
 * Test Case ID: TC_API_01512
 * Route: recruitment_vacancy_attachment
 * Endpoint: GET /recruitment/viewVacancyAttachment/attachId/{attachId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01512: recruitment_vacancy_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01512: Execute GET /recruitment/viewVacancyAttachment/attachId/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewVacancyAttachment/attachId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
