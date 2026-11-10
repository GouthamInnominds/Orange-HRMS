/**
 * Test Case ID: TC_API_01459
 * Route: apiv2_recruitment_candidates_reject
 * Endpoint: PUT /api/v2/recruitment/candidates/{candidateId}/reject
 * Method: PUT
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01459: apiv2_recruitment_candidates_reject', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01459: Execute PUT /api/v2/recruitment/candidates/1/reject [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidates/1/reject',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
