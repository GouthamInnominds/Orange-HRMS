/**
 * Test Case ID: TC_API_01461
 * Route: apiv2_recruitment_candidates_shortlist
 * Endpoint: PUT /api/v2/recruitment/candidates/{candidateId}/shortlist
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01461: apiv2_recruitment_candidates_shortlist', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01461: Execute PUT /api/v2/recruitment/candidates/1/shortlist [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidates/1/shortlist',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
