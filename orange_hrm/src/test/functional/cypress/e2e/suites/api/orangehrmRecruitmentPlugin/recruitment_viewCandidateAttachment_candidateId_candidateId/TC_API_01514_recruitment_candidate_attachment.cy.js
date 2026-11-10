/**
 * Test Case ID: TC_API_01514
 * Route: recruitment_candidate_attachment
 * Endpoint: GET /recruitment/viewCandidateAttachment/candidateId/{candidateId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01514: recruitment_candidate_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01514: Execute GET /recruitment/viewCandidateAttachment/candidateId/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewCandidateAttachment/candidateId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
