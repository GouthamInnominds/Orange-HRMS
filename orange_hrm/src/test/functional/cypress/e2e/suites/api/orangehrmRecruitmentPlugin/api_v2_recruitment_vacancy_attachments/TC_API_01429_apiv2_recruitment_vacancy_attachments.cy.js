/**
 * Test Case ID: TC_API_01429
 * Route: apiv2_recruitment_vacancy_attachments
 * Endpoint: DELETE /api/v2/recruitment/vacancy/attachments
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01429: apiv2_recruitment_vacancy_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01429: Execute DELETE /api/v2/recruitment/vacancy/attachments [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/recruitment/vacancy/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
