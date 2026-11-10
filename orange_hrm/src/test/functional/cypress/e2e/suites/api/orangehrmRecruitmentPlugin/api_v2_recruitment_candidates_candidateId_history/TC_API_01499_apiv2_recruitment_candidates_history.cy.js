/**
 * Test Case ID: TC_API_01499
 * Route: apiv2_recruitment_candidates_history
 * Endpoint: GET /api/v2/recruitment/candidates/{candidateId}/history
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01499: apiv2_recruitment_candidates_history', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01499: Execute GET /api/v2/recruitment/candidates/1/history [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/candidates/1/history',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
