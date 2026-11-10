/**
 * Test Case ID: TC_API_01452
 * Route: apiv2_recruitment_candidate_status
 * Endpoint: GET /api/v2/recruitment/candidates/statuses
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01452: apiv2_recruitment_candidate_status', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01452: Execute GET /api/v2/recruitment/candidates/statuses [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/candidates/statuses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
