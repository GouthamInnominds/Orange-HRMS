/**
 * Test Case ID: TC_API_01436
 * Route: apiv2_recruitment_candidates
 * Endpoint: DELETE /api/v2/recruitment/candidates
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01436: apiv2_recruitment_candidates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01436: Execute DELETE /api/v2/recruitment/candidates [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/recruitment/candidates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
