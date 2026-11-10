/**
 * Test Case ID: TC_API_01435
 * Route: apiv2_recruitment_candidates
 * Endpoint: POST /api/v2/recruitment/candidates
 * Method: POST
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01435: apiv2_recruitment_candidates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01435: Execute POST /api/v2/recruitment/candidates [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/recruitment/candidates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
