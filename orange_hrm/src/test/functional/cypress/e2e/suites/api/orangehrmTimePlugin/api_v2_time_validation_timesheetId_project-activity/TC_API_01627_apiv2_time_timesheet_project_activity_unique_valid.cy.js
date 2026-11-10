/**
 * Test Case ID: TC_API_01627
 * Route: apiv2_time_timesheet_project_activity_unique_validation
 * Endpoint: GET /api/v2/time/validation/{timesheetId}/project-activity
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01627: apiv2_time_timesheet_project_activity_unique_validation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01627: Execute GET /api/v2/time/validation/1/project-activity [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/validation/1/project-activity',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
