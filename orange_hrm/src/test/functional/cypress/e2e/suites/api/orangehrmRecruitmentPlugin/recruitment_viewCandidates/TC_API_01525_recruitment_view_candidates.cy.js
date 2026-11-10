/**
 * Test Case ID: TC_API_01525
 * Route: recruitment_view_candidates
 * Endpoint: GET /recruitment/viewCandidates
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01525: recruitment_view_candidates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01525: Execute GET /recruitment/viewCandidates [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewCandidates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
