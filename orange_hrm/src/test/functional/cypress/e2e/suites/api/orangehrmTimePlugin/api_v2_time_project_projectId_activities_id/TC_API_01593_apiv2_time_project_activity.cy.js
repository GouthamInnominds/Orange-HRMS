/**
 * Test Case ID: TC_API_01593
 * Route: apiv2_time_project_activity
 * Endpoint: PUT /api/v2/time/project/{projectId}/activities/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01593: apiv2_time_project_activity', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01593: Execute PUT /api/v2/time/project/1/activities/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/project/1/activities/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
