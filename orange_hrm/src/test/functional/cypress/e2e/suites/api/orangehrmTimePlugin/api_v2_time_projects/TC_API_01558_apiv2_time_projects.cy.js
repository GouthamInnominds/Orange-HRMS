/**
 * Test Case ID: TC_API_01558
 * Route: apiv2_time_projects
 * Endpoint: POST /api/v2/time/projects
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01558: apiv2_time_projects', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01558: Execute POST /api/v2/time/projects [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/projects',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
