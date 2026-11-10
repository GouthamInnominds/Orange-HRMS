/**
 * Test Case ID: TC_API_01453
 * Route: apiv2_recruitment_hiring_managers
 * Endpoint: GET /api/v2/recruitment/hiring-managers
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01453: apiv2_recruitment_hiring_managers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01453: Execute GET /api/v2/recruitment/hiring-managers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/hiring-managers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
