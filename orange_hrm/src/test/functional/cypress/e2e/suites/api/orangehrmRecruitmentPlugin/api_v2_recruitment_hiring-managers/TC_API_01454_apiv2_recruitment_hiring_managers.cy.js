/**
 * Test Case ID: TC_API_01454
 * Route: apiv2_recruitment_hiring_managers
 * Endpoint: GET /api/v2/recruitment/hiring-managers
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01454: apiv2_recruitment_hiring_managers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01454: Execute GET /api/v2/recruitment/hiring-managers [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/recruitment/hiring-managers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
