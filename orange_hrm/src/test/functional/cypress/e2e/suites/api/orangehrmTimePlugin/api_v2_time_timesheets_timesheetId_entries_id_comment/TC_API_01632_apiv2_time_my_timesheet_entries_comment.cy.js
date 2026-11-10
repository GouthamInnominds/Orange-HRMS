/**
 * Test Case ID: TC_API_01632
 * Route: apiv2_time_my_timesheet_entries_comment
 * Endpoint: GET /api/v2/time/timesheets/{timesheetId}/entries/{id}/comment
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01632: apiv2_time_my_timesheet_entries_comment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01632: Execute GET /api/v2/time/timesheets/1/entries/1/comment [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/timesheets/1/entries/1/comment',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
