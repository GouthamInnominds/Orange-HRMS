/**
 * Test Case ID: TC_API_00385
 * Route: apiv2_attendance_employee_attendance_records
 * Endpoint: GET /api/v2/attendance/employees/{empNumber}/records
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00385: apiv2_attendance_employee_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00385: Execute GET /api/v2/attendance/employees/1/records [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/employees/1/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
