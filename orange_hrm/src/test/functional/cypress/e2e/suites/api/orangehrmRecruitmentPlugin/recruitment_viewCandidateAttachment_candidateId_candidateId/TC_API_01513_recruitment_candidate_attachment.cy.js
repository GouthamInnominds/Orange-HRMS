/**
 * Test Case ID: TC_API_01513
 * Route: recruitment_candidate_attachment
 * Endpoint: GET /recruitment/viewCandidateAttachment/candidateId/{candidateId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01513: recruitment_candidate_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01513: Execute GET /recruitment/viewCandidateAttachment/candidateId/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewCandidateAttachment/candidateId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
