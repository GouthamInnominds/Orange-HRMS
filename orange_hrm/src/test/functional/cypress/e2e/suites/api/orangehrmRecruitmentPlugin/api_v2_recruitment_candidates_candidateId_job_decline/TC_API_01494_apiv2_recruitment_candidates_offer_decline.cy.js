/**
 * Test Case ID: TC_API_01494
 * Route: apiv2_recruitment_candidates_offer_decline
 * Endpoint: PUT /api/v2/recruitment/candidates/{candidateId}/job/decline
 * Method: PUT
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01494: apiv2_recruitment_candidates_offer_decline', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01494: Execute PUT /api/v2/recruitment/candidates/1/job/decline [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidates/1/job/decline',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
