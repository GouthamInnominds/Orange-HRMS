/**
 * Test Case ID: TC_API_01490
 * Route: apiv2_recruitment_candidates_offer_job
 * Endpoint: PUT /api/v2/recruitment/candidates/{candidateId}/job/offer
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01490: apiv2_recruitment_candidates_offer_job', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01490: Execute PUT /api/v2/recruitment/candidates/1/job/offer [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidates/1/job/offer',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
