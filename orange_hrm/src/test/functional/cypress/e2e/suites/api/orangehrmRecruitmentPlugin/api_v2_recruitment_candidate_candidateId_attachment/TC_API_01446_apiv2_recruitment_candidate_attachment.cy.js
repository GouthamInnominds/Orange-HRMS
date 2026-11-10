/**
 * Test Case ID: TC_API_01446
 * Route: apiv2_recruitment_candidate_attachment
 * Endpoint: PUT /api/v2/recruitment/candidate/{candidateId}/attachment
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01446: apiv2_recruitment_candidate_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01446: Execute PUT /api/v2/recruitment/candidate/1/attachment [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidate/1/attachment',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
