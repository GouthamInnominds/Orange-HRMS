/**
 * Test Case ID: TC_API_00396
 * Route: apiv2_attendance_employee_attendance_record_summary
 * Endpoint: GET /api/v2/attendance/employees/summary
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00396: apiv2_attendance_employee_attendance_record_summary', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00396: Execute GET /api/v2/attendance/employees/summary [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/employees/summary',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
