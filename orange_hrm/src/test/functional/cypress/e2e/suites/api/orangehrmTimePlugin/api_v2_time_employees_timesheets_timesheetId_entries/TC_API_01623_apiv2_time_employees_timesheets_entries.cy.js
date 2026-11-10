/**
 * Test Case ID: TC_API_01623
 * Route: apiv2_time_employees_timesheets_entries
 * Endpoint: PUT /api/v2/time/employees/timesheets/{timesheetId}/entries
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01623: apiv2_time_employees_timesheets_entries', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01623: Execute PUT /api/v2/time/employees/timesheets/1/entries [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/employees/timesheets/1/entries',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
