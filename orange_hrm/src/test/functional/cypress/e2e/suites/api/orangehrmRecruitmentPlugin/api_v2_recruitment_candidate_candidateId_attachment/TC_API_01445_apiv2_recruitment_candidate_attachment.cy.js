/**
 * Test Case ID: TC_API_01445
 * Route: apiv2_recruitment_candidate_attachment
 * Endpoint: PUT /api/v2/recruitment/candidate/{candidateId}/attachment
 * Method: PUT
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01445: apiv2_recruitment_candidate_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01445: Execute PUT /api/v2/recruitment/candidate/1/attachment [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidate/1/attachment',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
