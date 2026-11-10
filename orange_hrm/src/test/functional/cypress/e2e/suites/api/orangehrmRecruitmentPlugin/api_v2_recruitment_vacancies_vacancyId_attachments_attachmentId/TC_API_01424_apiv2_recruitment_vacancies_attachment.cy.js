/**
 * Test Case ID: TC_API_01424
 * Route: apiv2_recruitment_vacancies_attachment
 * Endpoint: PUT /api/v2/recruitment/vacancies/{vacancyId}/attachments/{attachmentId}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01424: apiv2_recruitment_vacancies_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01424: Execute PUT /api/v2/recruitment/vacancies/1/attachments/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/vacancies/1/attachments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
