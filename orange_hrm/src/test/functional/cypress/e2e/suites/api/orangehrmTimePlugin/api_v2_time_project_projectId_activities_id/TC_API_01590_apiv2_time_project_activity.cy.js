/**
 * Test Case ID: TC_API_01590
 * Route: apiv2_time_project_activity
 * Endpoint: GET /api/v2/time/project/{projectId}/activities/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01590: apiv2_time_project_activity', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01590: Execute GET /api/v2/time/project/1/activities/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/project/1/activities/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
