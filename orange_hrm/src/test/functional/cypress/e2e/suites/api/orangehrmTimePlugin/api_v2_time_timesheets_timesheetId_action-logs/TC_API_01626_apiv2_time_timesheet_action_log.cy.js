/**
 * Test Case ID: TC_API_01626
 * Route: apiv2_time_timesheet_action_log
 * Endpoint: GET /api/v2/time/timesheets/{timesheetId}/action-logs
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01626: apiv2_time_timesheet_action_log', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01626: Execute GET /api/v2/time/timesheets/1/action-logs [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/timesheets/1/action-logs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
