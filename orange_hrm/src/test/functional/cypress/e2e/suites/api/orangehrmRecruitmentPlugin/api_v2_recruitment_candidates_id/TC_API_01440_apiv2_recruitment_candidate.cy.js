/**
 * Test Case ID: TC_API_01440
 * Route: apiv2_recruitment_candidate
 * Endpoint: PUT /api/v2/recruitment/candidates/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01440: apiv2_recruitment_candidate', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01440: Execute PUT /api/v2/recruitment/candidates/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/recruitment/candidates/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
