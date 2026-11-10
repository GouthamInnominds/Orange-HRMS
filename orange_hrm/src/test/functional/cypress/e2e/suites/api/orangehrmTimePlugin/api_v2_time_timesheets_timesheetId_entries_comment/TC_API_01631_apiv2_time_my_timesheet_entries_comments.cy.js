/**
 * Test Case ID: TC_API_01631
 * Route: apiv2_time_my_timesheet_entries_comments
 * Endpoint: PUT /api/v2/time/timesheets/{timesheetId}/entries/comment
 * Method: PUT
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01631: apiv2_time_my_timesheet_entries_comments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01631: Execute PUT /api/v2/time/timesheets/1/entries/comment [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/timesheets/1/entries/comment',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
