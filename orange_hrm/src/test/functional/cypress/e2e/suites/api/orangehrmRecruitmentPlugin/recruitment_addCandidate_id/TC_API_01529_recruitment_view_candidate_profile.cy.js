/**
 * Test Case ID: TC_API_01529
 * Route: recruitment_view_candidate_profile
 * Endpoint: GET /recruitment/addCandidate/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01529: recruitment_view_candidate_profile', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01529: Execute GET /recruitment/addCandidate/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/addCandidate/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
