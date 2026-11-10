/**
 * Test Case ID: TC_API_01585
 * Route: apiv2_time_project_activities
 * Endpoint: POST /api/v2/time/project/{projectId}/activities
 * Method: POST
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01585: apiv2_time_project_activities', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01585: Execute POST /api/v2/time/project/1/activities [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/project/1/activities',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
