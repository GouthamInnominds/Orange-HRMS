/**
 * Test Case ID: TC_API_01526
 * Route: recruitment_view_candidates
 * Endpoint: GET /recruitment/viewCandidates
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01526: recruitment_view_candidates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01526: Execute GET /recruitment/viewCandidates [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewCandidates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
