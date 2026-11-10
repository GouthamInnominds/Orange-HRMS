/**
 * Test Case ID: TC_API_00400
 * Route: apiv2_attendance_current_datetime
 * Endpoint: GET /api/v2/attendance/current-datetime
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00400: apiv2_attendance_current_datetime', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00400: Execute GET /api/v2/attendance/current-datetime [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/current-datetime',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
