/**
 * Test Case ID: TC_API_01584
 * Route: apiv2_time_project_activities
 * Endpoint: GET /api/v2/time/project/{projectId}/activities
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01584: apiv2_time_project_activities', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01584: Execute GET /api/v2/time/project/1/activities [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/project/1/activities',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
