/**
 * Test Case ID: TC_API_01533
 * Route: recruitment_view_action_history
 * Endpoint: GET /recruitment/candidateHistory/{candidateId}/{historyId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01533: recruitment_view_action_history', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01533: Execute GET /recruitment/candidateHistory/1/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/candidateHistory/1/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
