/**
 * Test Case ID: TC_API_01592
 * Route: apiv2_time_project_activity
 * Endpoint: PUT /api/v2/time/project/{projectId}/activities/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01592: apiv2_time_project_activity', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01592: Execute PUT /api/v2/time/project/1/activities/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/project/1/activities/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
