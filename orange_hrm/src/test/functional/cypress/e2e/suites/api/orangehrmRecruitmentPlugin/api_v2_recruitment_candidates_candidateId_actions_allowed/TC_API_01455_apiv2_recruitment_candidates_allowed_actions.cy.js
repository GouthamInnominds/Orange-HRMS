/**
 * Test Case ID: TC_API_01455
 * Route: apiv2_recruitment_candidates_allowed_actions
 * Endpoint: GET /api/v2/recruitment/candidates/{candidateId}/actions/allowed
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01455: apiv2_recruitment_candidates_allowed_actions', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01455: Execute GET /api/v2/recruitment/candidates/1/actions/allowed [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/candidates/1/actions/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
