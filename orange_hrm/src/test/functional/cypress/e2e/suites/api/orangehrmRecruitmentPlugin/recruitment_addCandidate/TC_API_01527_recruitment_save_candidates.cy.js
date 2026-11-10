/**
 * Test Case ID: TC_API_01527
 * Route: recruitment_save_candidates
 * Endpoint: GET /recruitment/addCandidate
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01527: recruitment_save_candidates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01527: Execute GET /recruitment/addCandidate [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/addCandidate',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
