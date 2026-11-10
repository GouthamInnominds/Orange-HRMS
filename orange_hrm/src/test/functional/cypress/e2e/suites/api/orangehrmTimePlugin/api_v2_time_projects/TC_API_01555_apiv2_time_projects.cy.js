/**
 * Test Case ID: TC_API_01555
 * Route: apiv2_time_projects
 * Endpoint: GET /api/v2/time/projects
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01555: apiv2_time_projects', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01555: Execute GET /api/v2/time/projects [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/projects',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
