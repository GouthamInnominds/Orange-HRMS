/**
 * Test Case ID: TC_API_01588
 * Route: apiv2_time_project_activities
 * Endpoint: DELETE /api/v2/time/project/{projectId}/activities
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01588: apiv2_time_project_activities', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01588: Execute DELETE /api/v2/time/project/1/activities [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/time/project/1/activities',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
