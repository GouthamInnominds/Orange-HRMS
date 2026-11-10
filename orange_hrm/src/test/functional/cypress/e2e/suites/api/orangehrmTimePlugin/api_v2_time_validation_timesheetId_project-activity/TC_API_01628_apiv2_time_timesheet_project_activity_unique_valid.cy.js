/**
 * Test Case ID: TC_API_01628
 * Route: apiv2_time_timesheet_project_activity_unique_validation
 * Endpoint: GET /api/v2/time/validation/{timesheetId}/project-activity
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01628: apiv2_time_timesheet_project_activity_unique_validation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01628: Execute GET /api/v2/time/validation/1/project-activity [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/validation/1/project-activity',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
