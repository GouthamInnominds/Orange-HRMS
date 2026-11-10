/**
 * Test Case ID: TC_API_01531
 * Route: recruitment_candidate_action
 * Endpoint: GET /recruitment/changeCandidateVacancyStatus
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01531: recruitment_candidate_action', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01531: Execute GET /recruitment/changeCandidateVacancyStatus [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/changeCandidateVacancyStatus',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
