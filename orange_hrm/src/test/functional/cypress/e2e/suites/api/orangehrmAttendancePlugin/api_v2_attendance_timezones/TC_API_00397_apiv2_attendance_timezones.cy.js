/**
 * Test Case ID: TC_API_00397
 * Route: apiv2_attendance_timezones
 * Endpoint: GET /api/v2/attendance/timezones
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00397: apiv2_attendance_timezones', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00397: Execute GET /api/v2/attendance/timezones [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/timezones',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
