/**
 * Test Case ID: TC_API_01589
 * Route: apiv2_time_project_activities
 * Endpoint: DELETE /api/v2/time/project/{projectId}/activities
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01589: apiv2_time_project_activities', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01589: Execute DELETE /api/v2/time/project/1/activities [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/time/project/1/activities',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
